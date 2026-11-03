<?php
/**
 * SenTechPLUS — API Notifications en Temps Réel
 * Actions supportées: get_count, mark_read, mark_all_read, list
 */
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../config/config.php';

$user = getCurrentUser();
$userId = $user['id'] ?? null;

$action = sanitize($_POST['action'] ?? $_GET['action'] ?? 'get_count');

switch ($action) {
    case 'get_count':
        $count = getUnreadNotificationsCount($userId);
        echo json_encode([
            'success' => true,
            'count' => $count
        ]);
        break;

    case 'mark_read':
        $notifId = sanitize($_POST['notif_id'] ?? '');
        if (!empty($notifId)) {
            markNotificationAsRead($notifId, $userId);
            $count = getUnreadNotificationsCount($userId);
            echo json_encode([
                'success' => true,
                'count' => $count,
                'message' => 'Notification marquée comme lue.'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'ID manquant.']);
        }
        break;

    case 'mark_all_read':
        markAllNotificationsAsRead($userId);
        echo json_encode([
            'success' => true,
            'count' => 0,
            'message' => 'Toutes les notifications ont été marquées comme lues.'
        ]);
        break;

    case 'list':
        $limit = max(1, min(50, (int)($_GET['limit'] ?? 10)));
        $unreadOnly = isset($_GET['unread']) && $_GET['unread'] === '1';
        $filter = sanitize($_GET['filter'] ?? null);
        $notifs = getUserNotifications($userId, $limit, $unreadOnly, $filter);
        $count = getUnreadNotificationsCount($userId);
        echo json_encode([
            'success' => true,
            'count' => $count,
            'notifications' => $notifs
        ]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Action non reconnue.']);
        break;
}
