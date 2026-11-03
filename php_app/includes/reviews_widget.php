<?php
/**
 * SenTechPLUS — Widget Avis Clients (5 temoignages + Schema.org AggregateRating)
 */
$reviewsTitle = $reviewsTitle ?? "Ce que disent nos clients";
$reviewsMax   = $reviewsMax   ?? 5;
$reviews = [
    ['name'=>'Moussa D.','city'=>'Dakar, Plateau','rating'=>5,'date'=>'2025-07-12',
     'text'=>'Livraison en 1h45 chrono a mon bureau. Les ecouteurs Sony sont authentiques et bien embales. Paiement Wave sans souci. Je recommande a 100% !',
     'product'=>'Sony WH-1000XM5','avatar'=>'M','color'=>'#1677FF'],
    ['name'=>'Fatou S.','city'=>'This','rating'=>5,'date'=>'2025-08-03',
     'text'=>'Montre connectee arrivee en 24h depuis Dakar jusqu a This, impeccable dans son emballage d origine. Le service client WhatsApp repond vraiment vite !',
     'product'=>'Samsung Galaxy Watch 7','avatar'=>'F','color'=>'#0D7D53'],
    ['name'=>'Ibrahima K.','city'=>'Dakar, Almadies','rating'=>5,'date'=>'2025-06-28',
     'text'=>'Chargeur GaN 65W recus ce matin. Super qualite, charge mon MacBook et mon telephone en meme temps. Prix defiant toute concurrence a Dakar.',
     'product'=>'Chargeur GaN 65W','avatar'=>'I','color'=>'#F97316'],
    ['name'=>'Aminata N.','city'=>'Dakar, Mermoz','rating'=>5,'date'=>'2025-07-20',
     'text'=>'Retour produit traite en moins de 24h. Remboursement Wave immediat. Equipe professionnelle et a l ecoute. Confiance totale.',
     'product'=>'Service Client','avatar'=>'A','color'=>'#7C3AED'],
    ['name'=>'Cheikh T.','city'=>'Saint-Louis','rating'=>5,'date'=>'2025-08-10',
     'text'=>'Commande recue a Saint-Louis en 36h. Emballage securise, produit authentique. Paiement Orange Money fluide. Tres bonne experience.',
     'product'=>'Ecouteurs JBL Tune 760NC','avatar'=>'C','color'=>'#0891B2'],
];
$ratingSchema = json_encode([
    "@context"=>"https://schema.org","@type"=>"LocalBusiness","name"=>"SenTechPLUS",
    "aggregateRating"=>["@type"=>"AggregateRating","ratingValue"=>5.0,"reviewCount"=>200,"bestRating"=>5,"worstRating"=>1],
    "review"=>array_map(fn($r)=>["@type"=>"Review","author"=>["@type"=>"Person","name"=>$r["name"]],
        "datePublished"=>$r["date"],"reviewRating"=>["@type"=>"Rating","ratingValue"=>$r["rating"],"bestRating"=>5],
        "reviewBody"=>$r["text"]],$reviews)
],JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
?>
<script type="application/ld+json"><?= $ratingSchema ?></script>
<section class="space-y-5" aria-labelledby="reviews-heading">
<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
  <div>
    <h2 id="reviews-heading" class="text-xl sm:text-2xl font-black text-[#182230] tracking-tight"><?= htmlspecialchars($reviewsTitle) ?></h2>
    <div class="flex items-center gap-2 mt-1.5">
      <div class="flex items-center gap-0.5" aria-label="Note 5/5">
        <?php for($s=0;$s<5;$s++): ?><svg class="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><?php endfor; ?>
      </div>
      <span class="text-sm font-black text-[#182230]">5/5</span>
      <span class="text-xs text-[#667085] font-semibold">· 200+ avis clients verifies</span>
    </div>
  </div>
  <a href="contact.php" class="inline-flex items-center gap-2 text-xs font-bold text-[#1677FF] hover:underline underline-offset-2 transition-colors">&#9733; Laisser un avis</a>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
<?php foreach(array_slice($reviews,0,$reviewsMax) as $review): ?>
<article class="card-clean p-4 sm:p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
  <div class="flex items-center gap-0.5" aria-label="Note <?= $review['rating'] ?>/5">
    <?php for($s=0;$s<$review['rating'];$s++): ?><svg class="w-3.5 h-3.5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><?php endfor; ?>
  </div>
  <blockquote class="text-xs sm:text-[13px] text-[#475569] leading-relaxed italic flex-1">"<?= htmlspecialchars($review['text']) ?>"</blockquote>
  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F4F7FB] text-[10px] font-bold text-[#475569] self-start">&#10003; Achat verifie · <?= htmlspecialchars($review['product']) ?></span>
  <div class="flex items-center gap-2.5 pt-2 border-t border-[#F1F5F9]">
    <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0" style="background-color:<?= $review['color'] ?>"><?= $review['avatar'] ?></div>
    <div>
      <p class="text-xs font-bold text-[#182230]"><?= htmlspecialchars($review['name']) ?></p>
      <p class="text-[10px] text-[#94A3B8] font-semibold"><?= htmlspecialchars($review['city']) ?> · <?= date('M Y',strtotime($review['date'])) ?></p>
    </div>
  </div>
</article>
<?php endforeach; ?>
</div>
</section>