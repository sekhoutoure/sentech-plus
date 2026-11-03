<?php
/**
 * =============================================================================
 * SenTechPLUS — SecureUploader Service (Magic Bytes, Re-compression WebP & Sandbox)
 * Normes : OWASP File Upload Security, CWE-434, CWE-509
 * =============================================================================
 */

class SecureUploader {
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
    ];

    private const MAX_FILE_SIZE = 5242880; // 5 MB max

    /**
     * Traite, valide et assainit un fichier image uploadé
     * Convertit systématiquement en WebP sécurisé sans EXIF ni métadonnées
     *
     * @param array $file Le tableau $_FILES['input_name']
     * @param string $subDir Sous-dossier de destination (ex: 'logos', 'products', 'avatars')
     * @param int $maxWidth Largeur maximale de redimensionnement
     * @param int $maxHeight Hauteur maximale de redimensionnement
     * @return array ['success' => bool, 'path' => string, 'error' => ?string]
     */
    public static function processImageUpload(
        array $file,
        string $subDir = 'general',
        int $maxWidth = 1200,
        int $maxHeight = 1200
    ): array {
        // 1. Vérification du code d'erreur upload natif PHP
        if (!isset($file['error']) || is_array($file['error'])) {
            return ['success' => false, 'path' => '', 'error' => "Paramètre d'upload invalide."];
        }

        switch ($file['error']) {
            case UPLOAD_ERR_OK:
                break;
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                return ['success' => false, 'path' => '', 'error' => "Le fichier dépasse la taille maximale autorisée (5 Mo)."];
            case UPLOAD_ERR_NO_FILE:
                return ['success' => false, 'path' => '', 'error' => "Aucun fichier n'a été sélectionné."];
            default:
                return ['success' => false, 'path' => '', 'error' => "Erreur inconnue lors du téléversement."];
        }

        // 2. Vérification de la taille
        if ($file['size'] > self::MAX_FILE_SIZE) {
            return ['success' => false, 'path' => '', 'error' => "L'image est trop lourde (maximum 5 Mo)."];
        }

        $tmpPath = $file['tmp_name'];
        if (!is_uploaded_file($tmpPath)) {
            return ['success' => false, 'path' => '', 'error' => "Fichier uploadé suspect détecté."];
        }

        // 3. Validation par Magic Bytes (finfo)
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($tmpPath);

        if (!array_key_exists($mime, self::ALLOWED_MIME_TYPES)) {
            return ['success' => false, 'path' => '', 'error' => "Format d'image non supporté (seuls JPG, PNG et WEBP sont acceptés)."];
        }

        // 4. Validation supplémentaire par getimagesize()
        $imgInfo = @getimagesize($tmpPath);
        if ($imgInfo === false) {
            return ['success' => false, 'path' => '', 'error' => "Le fichier n'est pas une image valide."];
        }

        list($srcWidth, $srcHeight) = $imgInfo;
        if ($srcWidth <= 0 || $srcHeight <= 0) {
            return ['success' => false, 'path' => '', 'error' => "Dimensions de l'image corrompues."];
        }

        // 5. Création de la ressource image selon le format source (Neutralise les Web Shells polyglottes)
        $srcImage = null;
        switch ($mime) {
            case 'image/jpeg':
                $srcImage = @imagecreatefromjpeg($tmpPath);
                break;
            case 'image/png':
                $srcImage = @imagecreatefrompng($tmpPath);
                break;
            case 'image/webp':
                if (function_exists('imagecreatefromwebp')) {
                    $srcImage = @imagecreatefromwebp($tmpPath);
                }
                break;
        }

        if (!$srcImage) {
            return ['success' => false, 'path' => '', 'error' => "Impossible de décoder l'image de manière sécurisée."];
        }

        // 6. Calcul des dimensions proportionnelles
        $ratio = min($maxWidth / $srcWidth, $maxHeight / $srcHeight, 1.0);
        $dstWidth = (int)round($srcWidth * $ratio);
        $dstHeight = (int)round($srcHeight * $ratio);

        $dstImage = imagecreatetruecolor($dstWidth, $dstHeight);

        // Préservation de la transparence pour PNG/WebP
        imagealphablending($dstImage, false);
        imagesavealpha($dstImage, true);
        $transparent = imagecolorallocatealpha($dstImage, 255, 255, 255, 127);
        imagefilledrectangle($dstImage, 0, 0, $dstWidth, $dstHeight, $transparent);
        imagealphablending($dstImage, true);

        // Ré-échantillonnage de haute qualité (détruit tout payload caché dans les octets bruts)
        imagecopyresampled($dstImage, $srcImage, 0, 0, 0, 0, $dstWidth, $dstHeight, $srcWidth, $srcHeight);
        imagedestroy($srcImage);

        // 7. Préparation du dossier de destination sécurisé
        $cleanSubDir = preg_replace('/[^a-zA-Z0-9_\-]/', '', $subDir);
        $targetDir = dirname(__DIR__) . '/assets/images/uploads/' . $cleanSubDir;
        if (!is_dir($targetDir)) {
            @mkdir($targetDir, 0755, true);
        }

        // Assure que le dossier d'upload possède un .htaccess anti-exécution
        self::ensureDirectorySecurity(dirname(__DIR__) . '/assets/images/uploads');

        // 8. Génération d'un nom de fichier UUID cryptographiquement sûr
        $newFilename = 'img_' . bin2hex(random_bytes(16)) . '.webp';
        $fullDestination = $targetDir . '/' . $newFilename;
        $relativeWebPath = 'assets/images/uploads/' . ($cleanSubDir ? $cleanSubDir . '/' : '') . $newFilename;

        // 9. Encodage WebP qualité 85 (sans métadonnées EXIF, zéro fuite GPS)
        $saved = false;
        if (function_exists('imagewebp')) {
            $saved = @imagewebp($dstImage, $fullDestination, 85);
        } else {
            // Fallback JPEG si WebP non compilé
            $fullDestination = $targetDir . '/' . str_replace('.webp', '.jpg', $newFilename);
            $relativeWebPath = 'assets/images/uploads/' . ($cleanSubDir ? $cleanSubDir . '/' : '') . str_replace('.webp', '.jpg', $newFilename);
            $saved = @imagejpeg($dstImage, $fullDestination, 88);
        }
        imagedestroy($dstImage);

        if (!$saved || !file_exists($fullDestination)) {
            return ['success' => false, 'path' => '', 'error' => "Échec de l'enregistrement sur le disque sécurisé."];
        }

        SecurityShield::logSecurityEvent('SECURE_UPLOAD_SUCCESS', "Image téléversée et ré-encodée avec succès ({$relativeWebPath})", [
            'original_name' => $file['name'],
            'mime' => $mime,
            'dimensions' => "{$dstWidth}x{$dstHeight}"
        ]);

        return [
            'success' => true,
            'path' => $relativeWebPath,
            'error' => null
        ];
    }

    /**
     * Crée un fichier .htaccess anti-exécution dans le dossier d'uploads
     */
    public static function ensureDirectorySecurity(string $uploadRootDir): void {
        $htaccessPath = $uploadRootDir . '/.htaccess';
        if (!file_exists($htaccessPath)) {
            $rules = "# Désactivation totale d'exécution de scripts dans les uploads\n"
                   . "Options -ExecCGI -Indexes\n"
                   . "RemoveHandler .php .phtml .php3 .php4 .php5 .php7 .phps .inc .cgi .pl .py\n"
                   . "<FilesMatch \"\\.(php|phtml|php3|php4|php5|php7|phps|inc|pl|py|cgi|sh|bat|exe|dll)$\">\n"
                   . "    Require all denied\n"
                   . "</FilesMatch>\n"
                   . "<IfModule mod_headers.c>\n"
                   . "    Header set X-Content-Type-Options \"nosniff\"\n"
                   . "</IfModule>\n";
            @file_put_contents($htaccessPath, $rules);
        }
    }
}