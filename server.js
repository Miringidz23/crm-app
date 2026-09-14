<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>متجر سوق DZ</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
:root{--p:#4f46e5;--pd:#3730a3;--tx:#1f2937;--g:#6b7280;--bg:#f3f4f6;--cd:#fff;--bd:#e5e7eb;--r:12px;--dg:#ef4444;--sc:#10b981;--wr:#f59e0b;--dk:#0ea5e9}
[data-t="dark"]{--tx:#e5e7eb;--g:#9ca3af;--bg:#0f172a;--cd:#1e293b;--bd:#334155}
*{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Tahoma,sans-serif}
body{background:var(--bg);color:var(--tx);transition:background .3s}
a{text-decoration:none;color:inherit}ul{list-style:none}
.container{max-width:1280px;margin:0 auto;padding:0 15px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 24px;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;transition:.3s}
.btn-p{background:var(--p);color:#fff}.btn-p:hover{background:var(--pd)}
.btn-o{background:transparent;border:2px solid var(--p);color:var(--p)}
.btn-w{background:#25D366;color:#fff}.btn-w:hover{background:#1da851}
.top-bar{background:#111827;color:#fff;padding:8px 0;font-size:12px}
.top-bar .container{display:flex;justify-content:center;gap:20px;flex-wrap:wrap}
.header{background:var(--cd);padding:12px 0;box-shadow:0 2px 6px rgba(0,0,0,.08);position:sticky;top:0;z-index:900}
.header .container{display:flex;align-items:center;gap:12px}
.logo{font-size:24px;font-weight:800;color:var(--p);display:flex;align-items:center;gap:8px}
.search{flex:1;display:flex;border:2px solid var(--bd);border-radius:10px;overflow:hidden}
.search input{flex:1;padding:11px;border:none;outline:none;background:var(--cd);color:var(--tx)}
.search button{padding:0 18px;background:var(--p);color:#fff;border:none;cursor:pointer}
.hacts{display:flex;gap:11px}
.hbtn{position:relative;font-size:21px;color:var(--g);cursor:pointer;background:none;border:none}
.hbtn:hover{color:var(--p)}
.badge{position:absolute;top:-6px;left:-8px;background:var(--dg);color:#fff;font-size:11px;font-weight:700;min-width:18px;height:18px;border-radius:9px;display:flex;align-items:center;justify-content:center;padding:0 4px}
.nav{background:var(--cd);border-top:1px solid var(--bd);overflow-x:auto}
.nav ul{display:flex;gap:5px;white-space:nowrap}
.nav a{display:block;padding:12px 16px;font-size:14px;font-weight:500}
.nav a:hover{color:var(--p)}
.hero{position:relative;height:320px;overflow:hidden}
.slide{position:absolute;inset:0;display:flex;align-items:center;padding:0 40px;opacity:0;transition:opacity .8s;color:#fff}
.slide.on{opacity:1}
.slide h1{font-size:36px;margin:10px 0}
.slide p{font-size:16px;opacity:.9;margin-bottom:18px}
.sbadge{background:rgba(255,255,255,.25);padding:5px 14px;border-radius:20px;font-size:13px}
.sdots{position:absolute;bottom:15px;left:50%;transform:translateX(-50%);display:flex;gap:8px}
.sdots i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.5);cursor:pointer}
.sdots i.on{background:#fff}
section{padding:40px 0}
.stitle{font-size:24px;font-weight:800;text-align:center;margin-bottom:30px;position:relative;padding-bottom:12px}
.stitle::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:55px;height:4px;background:var(--p);border-radius:2px}
.cats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:15px}
.cat{background:var(--cd);border-radius:var(--r);padding:22px 10px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.06);transition:.3s;cursor:pointer}
.cat:hover{transform:translateY(-6px)}
.cico{width:65px;height:65px;margin:0 auto 12px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;color:#fff}
.cat h3{font-size:14px}
.flash{background:var(--cd)}
.fhead{display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;flex-wrap:wrap;gap:12px}
.cd2{display:flex;gap:8px}
.cd2 div{background:var(--dg);color:#fff;padding:6px 12px;border-radius:8px;text-align:center;min-width:52px}
.cd2 span{display:block;font-size:19px;font-weight:700}
.cd2 small{font-size:10px}
.filters{display:flex;justify-content:center;gap:8px;margin-bottom:25px;flex-wrap:wrap}
.fbtn{padding:8px 18px;border:2px solid var(--bd);background:var(--cd);color:var(--tx);border-radius:20px;font-size:13px;font-weight:500;cursor:pointer;transition:.3s}
.fbtn.on,.fbtn:hover{background:var(--p);color:#fff;border-color:var(--p)}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.card{background:var(--cd);border-radius:var(--r);overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);transition:.3s;position:relative;color:var(--tx)}
.card:hover{transform:translateY(-5px);box-shadow:0 12px 24px rgba(0,0,0,.15)}
.cimg{height:180px;background:var(--bg);display:flex;align-items:center;justify-content:center;position:relative;cursor:pointer}
.cimg>i.pic{font-size:60px;color:var(--g);opacity:.4}
.cimg img{width:100%;height:100%;object-fit:cover}
.bdgs{position:absolute;top:8px;right:8px;display:flex;flex-direction:column;gap:4px}
.bdg{padding:3px 9px;border-radius:4px;font-size:11px;font-weight:700;color:#fff}
.bdg.sale{background:var(--dg)}.bdg.new{background:var(--sc)}.bdg.hot{background:var(--wr)}
.acts{position:absolute;top:8px;left:8px;display:flex;flex-direction:column;gap:6px}
.abtn{width:34px;height:34px;border-radius:50%;background:#fff;border:none;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.15);color:#6b7280;font-size:14px}
.abtn:hover{background:var(--p);color:#fff}
.abtn.liked{color:var(--dg)}
.cinfo{padding:15px}
.ccat{font-size:11px;color:var(--p);font-weight:600}
.cname{font-size:14px;font-weight:600;margin:6px 0;line-height:1.4;min-height:38px;cursor:pointer}
.cname:hover{color:var(--p)}
.rate{display:flex;align-items:center;gap:5px;margin-bottom:8px;font-size:12px}
.rate .st{color:var(--wr)}.rate small{color:var(--g)}
.price{display:flex;align-items:center;gap:8px;margin-bottom:12px}
.now{font-size:18px;font-weight:800;color:var(--p)}
.old{font-size:13px;color:var(--g);text-decoration:line-through}
.atc{width:100%;padding:10px;background:var(--p);color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer}
.atc:hover{background:var(--pd)}
.feats{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.feat{background:var(--cd);border-radius:var(--r);padding:25px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.06)}
.feat i{font-size:34px;color:var(--p);margin-bottom:10px}
.feat h3{font-size:15px;margin-bottom:5px}.feat p{font-size:13px;color:var(--g)}
.news{background:linear-gradient(135deg,var(--p),var(--pd));color:#fff;text-align:center}
.news i{font-size:42px;margin-bottom:12px}.news h2{font-size:24px;margin-bottom:8px}
.nform{display:flex;gap:10px;max-width:460px;margin:20px auto 0}
.nform input{flex:1;padding:13px;border:none;border-radius:8px;outline:none}
.footer{background:#111827;color:rgba(255,255,255,.8);padding:45px 0 0}
.fgrid{display:grid;grid-template-columns:2fr 1fr 1fr 1.4fr;gap:30px;margin-bottom:30px}
.fcol h3{color:#fff;font-size:16px;margin-bottom:15px;border-bottom:2px solid var(--p);display:inline-block;padding-bottom:6px}
.fcol li{margin-bottom:8px;font-size:14px}
.soc{display:flex;gap:10px;margin-top:12px}
.soc a{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center}
.soc a:hover{background:var(--p)}
.fbot{border-top:1px solid rgba(255,255,255,.1);padding:15px 0;text-align:center;font-size:13px}
.up{position:fixed;bottom:20px;left:20px;width:45px;height:45px;border-radius:50%;background:var(--p);color:#fff;border:none;font-size:18px;cursor:pointer;z-index:800;display:none}
.up.on{display:block}
.wa-float{position:fixed;bottom:78px;left:20px;width:52px;height:52px;border-radius:50%;background:#25D366;color:#fff;font-size:26px;display:flex;align-items:center;justify-content:center;z-index:800;box-shadow:0 4px 14px rgba(37,211,102,.5)}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:1500;display:none;align-items:center;justify-content:center;padding:12px}
.modal.on{display:flex}
.mbox{background:var(--cd);color:var(--tx);border-radius:var(--r);max-width:820px;width:100%;max-height:90vh;overflow-y:auto;position:relative;padding:24px}
.mclose{position:absolute;top:10px;left:10px;width:32px;height:32px;border-radius:50%;background:var(--bg);color:var(--tx);border:none;font-size:20px;cursor:pointer;z-index:5}
.drawer{position:fixed;top:0;left:0;width:390px;max-width:92%;height:100%;background:var(--cd);color:var(--tx);z-index:1600;transform:translateX(-100%);transition:.3s;display:flex;flex-direction:column;box-shadow:0 0 30px rgba(0,0,0,.25)}
.drawer.on{transform:translateX(0)}
.dhead{padding:16px;border-bottom:2px solid var(--bd);display:flex;justify-content:space-between;align-items:center}
.dbody{flex:1;overflow-y:auto;padding:14px}
.dfoot{padding:16px;border-top:2px solid var(--bd)}
.citem{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--bd)}
.citem .ci{width:58px;height:58px;background:var(--bg);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:21px;color:var(--g);overflow:hidden}
.citem .ci img{width:100%;height:100%;object-fit:cover}
.citem h4{font-size:13px;margin-bottom:5px}
.qty{display:flex;align-items:center;gap:6px;margin-top:6px}
.qty button{width:26px;height:26px;border:1px solid var(--bd);background:var(--cd);color:var(--tx);border-radius:5px;cursor:pointer}
.qty span{min-width:24px;text-align:center;font-weight:600}
.del{background:none;border:none;color:var(--dg);cursor:pointer;font-size:15px}
.srow{display:flex;justify-content:space-between;padding:6px 0;font-size:14px}
.srow.tot{font-size:18px;font-weight:700;color:var(--p);border-top:2px solid var(--bd);margin-top:8px;padding-top:10px}
.coup{display:flex;gap:8px;margin:10px 0}
.coup input{flex:1;padding:9px;border:2px solid var(--bd);border-radius:8px;outline:none;background:var(--cd);color:var(--tx)}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1550;display:none}
.overlay.on{display:block}
.toast{position:fixed;bottom:20px;right:20px;background:var(--sc);color:#fff;padding:13px 22px;border-radius:8px;z-index:2000;opacity:0;transform:translateY(80px);transition:.3s;font-weight:500}
.toast.on{opacity:1;transform:translateY(0)}
.empty{text-align:center;padding:50px 15px;color:var(--g)}
.empty i{font-size:55px;opacity:.3;margin-bottom:12px}
.dig-sec{background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff}
.dig-sec .stitle{color:#fff}
.dig-trust{display:flex;justify-content:center;gap:22px;flex-wrap:wrap;margin-bottom:26px;font-size:13px;opacity:.9}
.inp{width:100%;padding:11px;margin-bottom:10px;border:2px solid var(--bd);border-radius:8px;background:var(--cd);color:var(--tx);outline:none;font-size:14px}
.inp:focus{border-color:var(--p)}
.tabs{display:flex;gap:6px;border-bottom:2px solid var(--bd);margin:18px 0 14px;flex-wrap:wrap}
.tab{padding:9px 16px;background:none;border:none;color:var(--g);font-weight:600;cursor:pointer;border-bottom:3px solid transparent;font-size:14px}
.tab.on{color:var(--p);border-color:var(--p)}
.rev{padding:12px 0;border-bottom:1px solid var(--bd)}
.rev-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px}
.rev-n{font-weight:700;font-size:14px}
.spec{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--bd);font-size:14px}
.star-pick{font-size:24px;color:var(--wr);cursor:pointer;direction:ltr;display:inline-block}
.dlv{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.dlv label{border:2px solid var(--bd);border-radius:8px;padding:11px;cursor:pointer;text-align:center;font-size:13px}
.dlv input{display:none}
.dlv input:checked+span{color:var(--p);font-weight:700}
.dlv label:has(input:checked){border-color:var(--p);background:rgba(79,70,229,.07)}
@media(max-width:1024px){.grid{grid-template-columns:repeat(3,1fr)}.fgrid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){.search{display:none}.hero{height:230px}.slide{padding:0 25px}.slide h1{font-size:24px}.grid{grid-template-columns:repeat(2,1fr)}.feats{grid-template-columns:repeat(2,1fr)}.fgrid{grid-template-columns:1fr}.nform{flex-direction:column}}
@media(max-width:480px){.grid{grid-template-columns:1fr}.top-bar span:nth-child(3){display:none}}
</style>
</head>
<body>

<div class="top-bar"><div class="container">
<span><i class="fas fa-phone"></i> 0550 123 456</span>
<span><i class="fas fa-truck"></i> توصيل لـ58 ولاية</span>
<span><i class="fas fa-bolt"></i> منتجات رقمية فورية</span>
</div></div>

<header class="header"><div class="container">
<a href="#" class="logo"><i class="fas fa-store"></i> سـوق</a>
<div class="search"><input id="sInput" placeholder="ابحث عن منتجات..."><button onclick="doSearch()"><i class="fas fa-search"></i></button></div>
<div class="hacts">
<button class="hbtn" onclick="toggleTheme()" id="thBtn"><i class="fas fa-moon"></i></button>
<button class="hbtn" onclick="openWish()"><i class="fas fa-heart"></i><span class="badge" id="wCount">0</span></button>
<button class="hbtn" onclick="openCart()"><i class="fas fa-shopping-cart"></i><span class="badge" id="cCount">0</span></button>
</div>
</div></header>

<nav class="nav"><div class="container"><ul>
<li><a href="#">الرئيسية</a></li>
<li><a href="#digital">رقمية 💻</a></li>
<li><a href="#" onclick="filt('electronics');return false">إلكترونيات</a></li>
<li><a href="#" onclick="filt('fashion');return false">أزياء</a></li>
<li><a href="#" onclick="filt('home');return false">المنزل</a></li>
<li><a href="#" onclick="filt('sports');return false">رياضة</a></li>
<li><a href="#" onclick="filt('beauty');return false">جمال</a></li>
<li><a href="#flash">العروض 🔥</a></li>
</ul></div></nav>

<div class="hero">
<div class="slide on" style="background:linear-gradient(135deg,#667eea,#764ba2)"><div><span class="sbadge">عروض حصرية</span><h1>خصم يصل إلى 50%</h1><p>على جميع الإلكترونيات</p><a href="#prods" class="btn" style="background:#fff;color:#4f46e5">تسوق الآن</a></div></div>
<div class="slide" style="background:linear-gradient(135deg,#0f172a,#0ea5e9)"><div><span class="sbadge">⚡ تسليم فوري</span><h1>منتجات رقمية</h1><p>دورات وكتب وقوالب — استلام فوري</p><a href="#digital" class="btn" style="background:#fff;color:#0ea5e9">اكتشف</a></div></div>
<div class="slide" style="background:linear-gradient(135deg,#25D366,#128C7E)"><div><span class="sbadge">🇩🇿 توصيل 58 ولاية</span><h1>اطلب عبر واتساب</h1><p>الدفع عند الاستلام في كل الولايات</p><a href="#prods" class="btn" style="background:#fff;color:#128C7E">ابدأ</a></div></div>
<div class="sdots" id="dots"></div>
</div>

<section><div class="container">
<h2 class="stitle">تسوق حسب القسم</h2>
<div class="cats">
<div class="cat" onclick="filt('digital')"><div class="cico" style="background:linear-gradient(135deg,#0f172a,#0ea5e9)"><i class="fas fa-cloud-download-alt"></i></div><h3>رقمية 💻</h3></div>
<div class="cat" onclick="filt('electronics')"><div class="cico" style="background:linear-gradient(135deg,#667eea,#764ba2)"><i class="fas fa-laptop"></i></div><h3>إلكترونيات</h3></div>
<div class="cat" onclick="filt('fashion')"><div class="cico" style="background:linear-gradient(135deg,#f093fb,#f5576c)"><i class="fas fa-tshirt"></i></div><h3>أزياء</h3></div>
<div class="cat" onclick="filt('home')"><div class="cico" style="background:linear-gradient(135deg,#4facfe,#00f2fe)"><i class="fas fa-couch"></i></div><h3>المنزل</h3></div>
<div class="cat" onclick="filt('sports')"><div class="cico" style="background:linear-gradient(135deg,#43e97b,#38f9d7)"><i class="fas fa-running"></i></div><h3>رياضة</h3></div>
<div class="cat" onclick="filt('beauty')"><div class="cico" style="background:linear-gradient(135deg,#fa709a,#fee140)"><i class="fas fa-spa"></i></div><h3>جمال</h3></div>
<div class="cat" onclick="filt('books')"><div class="cico" style="background:linear-gradient(135deg,#a18cd1,#fbc2eb)"><i class="fas fa-book"></i></div><h3>كتب</h3></div>
</div>
</div></section>

<section class="dig-sec" id="digital"><div class="container">
<h2 class="stitle">💻 منتجات رقمية</h2>
<p style="text-align:center;margin:-20px 0 14px;opacity:.75;font-size:14px">تسليم فوري على بريدك — بلا شحن ولا انتظار ⚡</p>
<div class="dig-trust"><span><i class="fas fa-bolt"></i> استلام فوري</span><span><i class="fas fa-infinity"></i> مدى الحياة</span><span><i class="fas fa-shield-alt"></i> ضمان 7 أيام</span></div>
<div class="grid" id="digGrid"></div>
</div></section>

<section class="flash" id="flash"><div class="container">
<div class="fhead"><h2 class="stitle" style="margin:0">⚡ عروض فلاش</h2>
<div class="cd2"><div><span id="hh">00</span><small>ساعة</small></div><div><span id="mm">00</span><small>دقيقة</small></div><div><span id="ss">00</span><small>ثانية</small></div></div></div>
<div class="grid" id="flashGrid"></div>
</div></section>

<section id="prods"><div class="container">
<h2 class="stitle">منتجات مميزة</h2>
<div class="filters">
<button class="fbtn on" onclick="filt('all',this)">الكل</button>
<button class="fbtn" onclick="filt('digital',this)">رقمية</button>
<button class="fbtn" onclick="filt('electronics',this)">إلكترونيات</button>
<button class="fbtn" onclick="filt('fashion',this)">أزياء</button>
<button class="fbtn" onclick="filt('home',this)">المنزل</button>
<button class="fbtn" onclick="filt('sports',this)">رياضة</button>
<button class="fbtn" onclick="filt('beauty',this)">جمال</button>
<button class="fbtn" onclick="filt('books',this)">كتب</button>
</div>
<div class="grid" id="grid"></div>
</div></section>

<section style="background:var(--cd)"><div class="container">
<h2 class="stitle">الأكثر مبيعاً 🏆</h2>
<div class="grid" id="bestGrid"></div>
</div></section>

<section><div class="container"><div class="feats">
<div class="feat"><i class="fas fa-bolt"></i><h3>تسليم فوري</h3><p>للمنتجات الرقمية</p></div>
<div class="feat"><i class="fas fa-truck"></i><h3>58 ولاية</h3><p>توصيل لكل الجزائر</p></div>
<div class="feat"><i class="fas fa-money-bill-wave"></i><h3>الدفع عند الاستلام</h3><p>ادفع بعد ما تشوف</p></div>
<div class="feat"><i class="fab fa-whatsapp"></i><h3>طلب سريع</h3><p>عبر واتساب مباشرة</p></div>
</div></div></section>

<section class="news"><div class="container">
<i class="fas fa-envelope-open-text"></i><h2>اشترك في نشرتنا</h2><p>احصل على أحدث العروض</p>
<form class="nform" onsubmit="event.preventDefault();showToast('تم الاشتراك ✅');this.reset()">
<input type="email" placeholder="بريدك الإلكتروني" required><button class="btn" style="background:#fff;color:#4f46e5">اشترك</button></form>
</div></section>

<footer class="footer"><div class="container">
<div class="fgrid">
<div class="fcol"><h3><i class="fas fa-store"></i> سـوق</h3><p style="font-size:14px;line-height:1.8">متجرك الجزائري. منتجات مادية ورقمية بأفضل الأسعار مع التوصيل لكل الولايات.</p>
<div class="soc"><a href="#"><i class="fab fa-facebook-f"></i></a><a href="#"><i class="fab fa-instagram"></i></a><a id="waF" href="#"><i class="fab fa-whatsapp"></i></a><a href="#"><i class="fab fa-tiktok"></i></a></div></div>
<div class="fcol"><h3>روابط</h3><ul><li><a href="#">من نحن</a></li><li><a href="#">اتصل بنا</a></li><li><a href="#">الخصوصية</a></li><li><a href="#">الشروط</a></li></ul></div>
<div class="fcol"><h3>حسابي</h3><ul><li><a href="#">طلباتي</a></li><li><a href="#">تحميلاتي</a></li><li><a href="#">المفضلة</a></li><li><a href="#">المساعدة</a></li></ul></div>
<div class="fcol"><h3>تواصل</h3><ul><li><i class="fas fa-map-marker-alt"></i> الجزائر</li><li><i class="fas fa-phone"></i> 0550 123 456</li><li><i class="fas fa-envelope"></i> info@souq.dz</li></ul></div>
</div><div class="fbot">&copy; 2024 متجر سوق DZ 🇩🇿</div>
</div></footer>

<a class="wa-float" id="waFloat" href="#" target="_blank"><i class="fab fa-whatsapp"></i></a>
<button class="up" id="up" onclick="scrollTo({top:0,behavior:'smooth'})"><i class="fas fa-chevron-up"></i></button>
<div class="overlay" id="ov" onclick="closeAll()"></div>

<div class="drawer" id="cartD">
<div class="dhead"><h3><i class="fas fa-shopping-cart"></i> السلة</h3><button class="mclose" style="position:static" onclick="closeAll()">&times;</button></div>
<div class="dbody" id="cartBody"></div><div class="dfoot" id="cartFoot"></div></div>

<div class="drawer" id="wishD">
<div class="dhead"><h3><i class="fas fa-heart"></i> المفضلة</h3><button class="mclose" style="position:static" onclick="closeAll()">&times;</button></div>
<div class="dbody" id="wishBody"></div></div>

<div class="modal" id="pd"><div class="mbox"><button class="mclose" onclick="cls('pd')">&times;</button><div id="pdBody"></div></div></div>
<div class="modal" id="co"><div class="mbox" style="max-width:560px"><button class="mclose" onclick="cls('co')">&times;</button><div id="coBody"></div></div></div>
<div class="toast" id="toast"><i class="fas fa-check-circle"></i> <span id="tMsg"></span></div>

<script>
/* ====== ⚙️ الإعدادات ====== */
const WA = "213550123456"; 
const CUR = "دج";
const CRM_URL = "https://crm-app-6t6b.onrender.com/api/store-order";

// إيقاظ سيرفر الـ CRM تلقائياً في الخلفية عند دخول المتجر
if(CRM_URL) fetch(CRM_URL.replace('/api/store-order',''),{mode:'no-cors'}).catch(()=>{});
/* ======================== */

const W=[["أدرار",1000,600],["الشلف",700,400],["الأغواط",800,500],["أم البواقي",700,400],["باتنة",700,400],["بجاية",700,400],["بسكرة",750,450],["بشار",1000,600],["البليدة",600,350],["البويرة",700,400],["تمنراست",1200,800],["تبسة",800,450],["تلمسان",750,450],["تيارت",750,450],["تيزي وزو",700,400],["الجزائر",500,300],["الجلفة",800,450],["جيجل",700,400],["سطيف",700,400],["سعيدة",750,450],["سكيكدة",700,400],["سيدي بلعباس",750,450],["عنابة",700,400],["قالمة",700,400],["قسنطينة",700,400],["المدية",700,400],["مستغانم",700,400],["المسيلة",750,450],["معسكر",750,450],["ورقلة",900,550],["وهران",700,400],["البيض",900,550],["إليزي",1400,900],["برج بوعريريج",700,400],["بومرداس",600,350],["الطارف",750,450],["تندوف",1400,900],["تيسمسيلت",750,450],["الوادي",900,550],["خنشلة",800,450],["سوق أهراس",750,450],["تيبازة",600,350],["ميلة",700,400],["عين الدفلى",700,400],["النعامة",900,550],["عين تموشنت",750,450],["غرداية",900,550],["غليزان",700,400],["تيميمون",1100,700],["برج باجي مختار",1400,900],["أولاد جلال",850,500],["بني عباس",1100,700],["عين صالح",1300,850],["عين قزام",1400,900],["تقرت",900,550],["جانت",1400,900],["المغير",900,550],["المنيعة",1000,600]];

const P=[
{id:21,n:"دورة تعلم البرمجة من الصفر",c:"digital",p:12000,o:25000,r:4.9,rv:840,b:"hot",i:"fas fa-code",d:"40 ساعة فيديو + مشاريع عملية + شهادة إتمام. وصول مدى الحياة على كل الأجهزة.",sp:[["المدة","40 ساعة"],["الصيغة","MP4 HD"],["اللغة","عربية"],["الشهادة","نعم ✓"]],best:1,fl:1},
{id:22,n:"كتاب إلكتروني: التسويق الرقمي",c:"digital",p:2500,o:4000,r:4.7,rv:520,b:"sale",i:"fas fa-book-reader",d:"دليل شامل PDF بـ180 صفحة لإتقان التسويق الرقمي وإعلانات فيسبوك وإنستغرام.",sp:[["الصفحات","180"],["الصيغة","PDF"],["اللغة","عربية"],["التحديثات","مجانية"]],best:1,fl:0},
{id:23,n:"باقة 500 قالب تصميم احترافي",c:"digital",p:4500,o:9000,r:4.8,rv:310,b:"hot",i:"fas fa-palette",d:"قوالب PSD و Canva جاهزة للسوشيال ميديا والإعلانات والمنشورات.",sp:[["عدد القوالب","500"],["الصيغة","PSD + Canva"],["الحجم","2.4 GB"],["الترخيص","تجاري"]],best:1,fl:1},
{id:24,n:"اشتراك تصميم 12 شهر",c:"digital",p:18000,o:24000,r:4.6,rv:190,b:"new",i:"fas fa-crown",d:"وصول غير محدود لمكتبة القوالب والصور والخطوط لمدة سنة كاملة.",sp:[["المدة","12 شهر"],["التحميلات","غير محدودة"],["الدعم","24/7"]],best:0,fl:0},
{id:25,n:"مكتبة 10000 مؤثر صوتي",c:"digital",p:3200,o:5500,r:4.5,rv:270,b:"sale",i:"fas fa-music",d:"مؤثرات وموسيقى خالية من حقوق النشر لمونتاج الفيديوهات واليوتيوب.",sp:[["الملفات","10000"],["الصيغة","WAV/MP3"],["الحقوق","خالية"]],best:0,fl:1},
{id:26,n:"دورة الجرافيك ديزاين",c:"digital",p:9500,o:16000,r:4.8,rv:430,b:"hot",i:"fas fa-pen-nib",d:"Photoshop و Illustrator من المبتدئ للاحتراف + ملفات المشاريع كاملة.",sp:[["المدة","32 ساعة"],["البرامج","PS + AI"],["المشاريع","15"]],best:1,fl:0},
{id:1,n:"آيفون 15 برو ماكس 256GB",c:"electronics",p:249000,o:275000,r:4.8,rv:1250,b:"sale",i:"fas fa-mobile-alt",d:"معالج A17 Pro وكاميرا 48MP وشاشة Super Retina XDR بحجم 6.7 بوصة.",sp:[["الشاشة","6.7 بوصة"],["الذاكرة","256GB"],["الكاميرا","48MP"],["الضمان","سنة"]],best:1,fl:1},
{id:2,n:"سماعات AirPods Pro 2",c:"electronics",p:44900,o:54900,r:4.7,rv:890,b:"hot",i:"fas fa-headphones",d:"إلغاء ضوضاء نشط وجودة صوت استثنائية مع علبة شحن لاسلكية.",sp:[["البطارية","6 ساعات"],["ANC","نعم"],["المقاومة","IPX4"]],best:1,fl:1},
{id:3,n:"لابتوب ماك بوك اير M3",c:"electronics",p:224000,o:249000,r:4.9,rv:560,b:"new",i:"fas fa-laptop",d:"شريحة M3 وشاشة Liquid Retina وبطارية تدوم 18 ساعة.",sp:[["المعالج","Apple M3"],["الرام","8GB"],["التخزين","256GB"]],best:0,fl:0},
{id:4,n:"ساعة Apple Watch S9",c:"electronics",p:79900,o:89900,r:4.6,rv:430,b:"sale",i:"fas fa-clock",d:"مستشعر صحي متقدم وشاشة Always-On ومقاومة للماء.",sp:[["الشاشة","45mm"],["البطارية","18 ساعة"],["الماء","50m"]],best:0,fl:1},
{id:5,n:"سماعة بلوتوث JBL",c:"electronics",p:14900,o:19900,r:4.5,rv:1100,b:"hot",i:"fas fa-volume-up",d:"محمولة مقاومة للماء بصوت قوي وبطارية 12 ساعة.",sp:[["البطارية","12 ساعة"],["المقاومة","IPX7"],["القوة","30W"]],best:1,fl:0},
{id:6,n:"قميص رجالي قطن ممتاز",c:"fashion",p:3500,o:4900,r:4.3,rv:320,b:"sale",i:"fas fa-tshirt",d:"قطن ممتاز بتصميم أنيق ومريح للارتداء اليومي.",sp:[["الخامة","قطن 100%"],["المقاسات","S-XXL"],["الألوان","5"]],best:1,fl:0},
{id:7,n:"حذاء رياضي نايك اير ماكس",c:"fashion",p:24900,o:34900,r:4.5,rv:780,b:"hot",i:"fas fa-shoe-prints",d:"مريح مع تقنية Air Max للتوسيد المثالي أثناء الجري.",sp:[["المقاسات","39-45"],["الخامة","شبك + جلد"],["الأصل","أصلي"]],best:1,fl:1},
{id:8,n:"حقيبة يد جلد طبيعي",c:"fashion",p:17500,o:22500,r:4.4,rv:210,b:"new",i:"fas fa-shopping-bag",d:"أنيقة من الجلد الطبيعي بتصميم عصري وجيوب متعددة.",sp:[["الخامة","جلد طبيعي"],["الأبعاد","30x22cm"]],best:0,fl:0},
{id:9,n:"نظارات شمسية Ray-Ban",c:"fashion",p:32500,o:39900,r:4.6,rv:560,b:"sale",i:"fas fa-glasses",d:"أصلية مع حماية UV400 وعلبة أصلية وشهادة ضمان.",sp:[["الحماية","UV400"],["الأصل","أصلي"],["الضمان","سنتين"]],best:0,fl:1},
{id:10,n:"طقم أواني ستانلس 10 قطع",c:"home",p:39900,o:49900,r:4.7,rv:340,b:"sale",i:"fas fa-utensils",d:"ستانلس ستيل عالي الجودة مناسب لكل أنواع المواقد.",sp:[["القطع","10"],["الخامة","ستانلس 304"]],best:1,fl:0},
{id:11,n:"مكنسة روبوت ذكية",c:"home",p:64900,o:84900,r:4.5,rv:890,b:"hot",i:"fas fa-robot",d:"تحكم عبر التطبيق وتنظيف تلقائي مع خرائط ذكية للمنزل.",sp:[["البطارية","120 دقيقة"],["الشفط","2700Pa"],["التطبيق","نعم"]],best:1,fl:1},
{id:12,n:"ماكينة قهوة إسبريسو",c:"home",p:44900,o:59900,r:4.8,rv:670,b:"hot",i:"fas fa-coffee",d:"احترافية مع طحن حبوب مدمج ورغوة حليب أوتوماتيكية.",sp:[["الضغط","19 بار"],["الخزان","1.8L"]],best:1,fl:1},
{id:13,n:"وسائد فندقية طقم 2",c:"home",p:9900,o:14900,r:4.3,rv:450,b:"sale",i:"fas fa-bed",d:"فاخرة مريحة للنوم العميق بحشوة ميكروفايبر.",sp:[["العدد","2"],["الأبعاد","50x70"]],best:0,fl:0},
{id:14,n:"جهاز مشي قابل للطي",c:"sports",p:74900,o:99900,r:4.4,rv:230,b:"sale",i:"fas fa-running",d:"شاشة LCD وبرامج تمرين متعددة وقابل للطي لتوفير المساحة.",sp:[["السرعة","1-14 كم/س"],["المحرك","2.5HP"]],best:0,fl:0},
{id:15,n:"دمبل قابل للتعديل 24كغ",c:"sports",p:29900,o:39900,r:4.6,rv:180,b:"new",i:"fas fa-dumbbell",d:"ذكي قابل للتعديل من 2 إلى 24 كغ بضغطة واحدة.",sp:[["الوزن","2-24 كغ"],["المستويات","15"]],best:0,fl:1},
{id:16,n:"كرة يوغا مع مضخة",c:"sports",p:3900,o:5900,r:4.2,rv:390,b:"sale",i:"fas fa-basketball-ball",d:"مضادة للانفجار مع مضخة هوائية مجانية.",sp:[["القطر","65cm"],["التحمل","200كغ"]],best:0,fl:0},
{id:17,n:"عطر فاخر 100ml",c:"beauty",p:22500,o:32500,r:4.7,rv:520,b:"hot",i:"fas fa-spray-can",d:"عطر شرقي فاخر بثبات طويل يدوم 12 ساعة.",sp:[["الحجم","100ml"],["الثبات","12 ساعة"]],best:1,fl:1},
{id:18,n:"مجفف شعر احترافي",c:"beauty",p:15900,o:20900,r:4.4,rv:280,b:"sale",i:"fas fa-wind",d:"أيوني سريع الجفاف بـ3 سرعات وحماية من الحرارة.",sp:[["القوة","2200W"],["السرعات","3"]],best:0,fl:0},
{id:19,n:"طقم عناية بالبشرة",c:"beauty",p:13900,o:18900,r:4.5,rv:340,b:"new",i:"fas fa-pump-soap",d:"5 منتجات للعناية اليومية بالبشرة من غسول وسيروم ومرطب.",sp:[["القطع","5"],["النوع","كل البشرات"]],best:0,fl:0},
{id:20,n:"رواية عربية مميزة",c:"books",p:1900,o:2900,r:4.6,rv:150,b:"sale",i:"fas fa-book-open",d:"من أفضل الروايات العربية المعاصرة بغلاف فاخر.",sp:[["الصفحات","320"],["الغلاف","فاخر"]],best:0,fl:0}
];
const CN={electronics:"إلكترونيات",fashion:"أزياء",home:"المنزل",sports:"رياضة",beauty:"جمال",books:"كتب",digital:"رقمية"};
const DR={21:[["أمين ب.",5,"دورة ممتازة، شرح واضح جداً والمشاريع مفيدة 👌"],["سارة م.",5,"أحسن دورة برمجة عربية، نصحت بها كل أصدقائي"],["يوسف ك.",4,"محتوى قوي بس يحتاج تحديث في بعض الأجزاء"]],1:[["كريم ز.",5,"جهاز رائع والتوصيل كان سريع لولاية وهران"],["نبيل ع.",4,"ممتاز لكن السعر مرتفع شوية"]],7:[["محمد ص.",5,"أصلي 100% ومريح جداً في المشي"],["ريان ت.",4,"جميل بس المقاس جاء أصغر شوية"]]};

let cart=JSON.parse(localStorage.getItem('cart')||'[]');
let wish=JSON.parse(localStorage.getItem('wish')||'[]');
let revs=JSON.parse(localStorage.getItem('revs')||'{}');
let disc=0,cf='all',sq='',curP=null,pickStar=5;

document.getElementById('waFloat').href="https://wa.me/"+WA;
document.getElementById('waF').href="https://wa.me/"+WA;

function fmt(n){return n.toLocaleString('en-US')+' '+CUR}
function stars(r){let s='';for(let i=1;i<=5;i++)s+=i<=Math.floor(r)?'<i class="fas fa-star"></i>':(i-r<1?'<i class="fas fa-star-half-alt"></i>':'<i class="far fa-star"></i>');return s}
function cls(id){document.getElementById(id).classList.remove('on')}

function card(x){const off=x.o?Math.round((1-x.p/x.o)*100):0,lk=wish.includes(x.id),dg=x.c==='digital';
return `<div class="card"><div class="cimg" onclick="detail(${x.id})" ${dg?'style="background:linear-gradient(135deg,#e0f2fe,#f1f5f9)"':''}>${x.img?`<img src="${x.img}" loading="lazy">`:`<i class="${x.i} pic" ${dg?'style="color:#0ea5e9;opacity:.55"':''}></i>`}
<div class="bdgs">${x.b==='sale'?'<span class="bdg sale">تخفيض</span>':''}${x.b==='new'?'<span class="bdg new">جديد</span>':''}${x.b==='hot'?'<span class="bdg hot">رائج</span>':''}${off?`<span class="bdg sale">-${off}%</span>`:''}${dg?'<span class="bdg" style="background:#0ea5e9"><i class="fas fa-bolt"></i> فوري</span>':''}</div>
<div class="acts"><button class="abtn ${lk?'liked':''}" onclick="event.stopPropagation();tw(${x.id})"><i class="fas fa-heart"></i></button><button class="abtn" onclick="event.stopPropagation();detail(${x.id})"><i class="fas fa-eye"></i></button></div></div>
<div class="cinfo"><span class="ccat">${CN[x.c]}</span><h3 class="cname" onclick="detail(${x.id})">${x.n}</h3>
<div class="rate"><span class="st">${stars(x.r)}</span><small>(${x.rv})</small></div>
<div class="price"><span class="now">${fmt(x.p)}</span>${x.o?`<span class="old">${fmt(x.o)}</span>`:''}</div>
<button class="atc" ${dg?'style="background:#0ea5e9"':''} onclick="add(${x.id})"><i class="fas fa-${dg?'download':'cart-plus'}"></i> ${dg?'احصل عليه':'أضف للسلة'}</button></div></div>`}

function paint(){digGrid.innerHTML=P.filter(x=>x.c==='digital').map(card).join('');
flashGrid.innerHTML=P.filter(x=>x.fl).map(card).join('');
bestGrid.innerHTML=P.filter(x=>x.best).map(card).join('');render()}
function render(){let L=P.filter(x=>(cf==='all'||x.c===cf)&&(!sq||x.n.includes(sq)||x.d.includes(sq)));
grid.innerHTML=L.length?L.map(card).join(''):'<div class="empty" style="grid-column:1/-1"><i class="fas fa-search"></i><h3>لا توجد نتائج</h3></div>'}
function filt(c,el){cf=c;sq='';sInput.value='';document.querySelectorAll('.fbtn').forEach(b=>b.classList.remove('on'));
if(el)el.classList.add('on');else{const b=[...document.querySelectorAll('.fbtn')].find(b=>b.textContent.trim()===(c==='all'?'الكل':CN[c]));if(b)b.classList.add('on')}
render();prods.scrollIntoView({behavior:'smooth'})}
function doSearch(){sq=sInput.value.trim();cf='all';render();prods.scrollIntoView({behavior:'smooth'})}
sInput.addEventListener('keypress',e=>{if(e.key==='Enter')doSearch()});

/* ===== صفحة تفاصيل المنتج ===== */
function detail(id){curP=P.find(p=>p.id===id);const x=curP,dg=x.c==='digital';
const all=[...(DR[id]||[]),...(revs[id]||[])];
pdBody.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px" class="pdg">
<div style="height:280px;background:${dg?'linear-gradient(135deg,#e0f2fe,#f1f5f9)':'var(--bg)'};border-radius:12px;display:flex;align-items:center;justify-content:center;overflow:hidden">${x.img?`<img src="${x.img}" style="width:100%;height:100%;object-fit:cover">`:`<i class="${x.i}" style="font-size:95px;color:${dg?'#0ea5e9':'var(--g)'};opacity:.6"></i>`}</div>
<div><span class="ccat">${CN[x.c]}</span><h2 style="margin:8px 0;font-size:21px">${x.n}</h2>
<div class="rate"><span class="st">${stars(x.r)}</span><small>${x.r} · ${x.rv+all.length} تقييم</small></div>
<div class="price"><span class="now" style="font-size:26px">${fmt(x.p)}</span>${x.o?`<span class="old">${fmt(x.o)}</span>`:''}</div>
${dg?`<div style="background:rgba(14,165,233,.1);padding:11px;border-radius:8px;font-size:13px;color:#0284c7;margin-bottom:14px">
<div><i class="fas fa-bolt"></i> تسليم فوري على بريدك</div><div style="margin-top:4px"><i class="fas fa-infinity"></i> وصول مدى الحياة</div><div style="margin-top:4px"><i class="fas fa-shield-alt"></i> ضمان استرجاع 7 أيام</div></div>`
:`<div style="background:rgba(16,185,129,.1);padding:11px;border-radius:8px;font-size:13px;color:#059669;margin-bottom:14px">
<div><i class="fas fa-truck"></i> توصيل لكل الولايات 58</div><div style="margin-top:4px"><i class="fas fa-money-bill-wave"></i> الدفع عند الاستلام</div></div>
<div class="qty" style="margin-bottom:14px"><button onclick="mq(-1)">-</button><span id="mQ">1</span><button onclick="mq(1)">+</button></div>`}
<div style="display:flex;gap:8px;flex-wrap:wrap">
<button class="btn btn-p" ${dg?'style="background:#0ea5e9"':''} onclick="add(${x.id},${dg?1:"+document.getElementById('mQ').textContent"});cls('pd')"><i class="fas fa-cart-plus"></i> أضف للسلة</button>
<button class="btn btn-w" onclick="waOne(${x.id})"><i class="fab fa-whatsapp"></i> اطلب واتساب</button></div></div></div>
<div class="tabs"><button class="tab on" onclick="tb(0,this)">الوصف</button><button class="tab" onclick="tb(1,this)">المواصفات</button><button class="tab" onclick="tb(2,this)">التقييمات (${all.length})</button></div>
<div id="tbC"></div>`;
tb(0,document.querySelector('.tab'));document.getElementById('pd').classList.add('on')}

function tb(i,el){document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));el.classList.add('on');
const x=curP,all=[...(DR[x.id]||[]),...(revs[x.id]||[])];
if(i===0)tbC.innerHTML=`<p style="line-height:2;color:var(--g);font-size:15px">${x.d}</p>`;
else if(i===1)tbC.innerHTML=(x.sp||[]).map(s=>`<div class="spec"><b>${s[0]}</b><span style="color:var(--g)">${s[1]}</span></div>`).join('')||'<p style="color:var(--g)">لا توجد مواصفات</p>';
else tbC.innerHTML=`${all.map(r=>`<div class="rev"><div class="rev-h"><span class="rev-n">${r[0]}</span><span style="color:#f59e0b;font-size:13px">${'★'.repeat(r[1])}${'☆'.repeat(5-r[1])}</span></div><p style="color:var(--g);font-size:14px">${r[2]}</p></div>`).join('')||'<p style="color:var(--g);padding:10px 0">لا توجد تقييمات — كن أول من يقيّم!</p>'}
<div style="margin-top:18px;padding-top:14px;border-top:2px solid var(--bd)"><h4 style="margin-bottom:10px">✍️ أضف تقييمك</h4>
<div style="margin-bottom:8px"><span class="star-pick" id="sp"></span></div>
<input class="inp" id="rN" placeholder="اسمك"><textarea class="inp" id="rT" rows="2" placeholder="رأيك في المنتج..."></textarea>
<button class="btn btn-p" onclick="addRev()">إرسال التقييم</button></div>`,drawStars()}
function drawStars(){const e=document.getElementById('sp');if(!e)return;e.innerHTML=[1,2,3,4,5].map(i=>`<span onclick="pickStar=${i};drawStars()">${i<=pickStar?'★':'☆'}</span>`).join('')}
function addRev(){const n=rN.value.trim(),t=rT.value.trim();if(!n||!t)return showToast('املأ الحقول');
if(!revs[curP.id])revs[curP.id]=[];revs[curP.id].push([n,pickStar,t]);
localStorage.setItem('revs',JSON.stringify(revs));showToast('شكراً على تقييمك ⭐');detail(curP.id)}
function mq(d){const e=document.getElementById('mQ');e.textContent=Math.max(1,+e.textContent+d)}

/* ===== السلة ===== */
function add(id,q=1){const x=P.find(p=>p.id===id),e=cart.find(c=>c.id===id);
if(x.c==='digital'){if(e)return showToast('موجود في السلة ✓');cart.push({id:x.id,n:x.n,p:x.p,i:x.i,c:x.c,img:x.img,q:1})}
else{if(e)e.q+=q;else cart.push({id:x.id,n:x.n,p:x.p,i:x.i,c:x.c,img:x.img,q:q})}
save();showToast(x.c==='digital'?'أضيف — تسليم فوري ⚡':'تمت الإضافة 🛒')}
function del(id){cart=cart.filter(c=>c.id!==id);save();drawCart()}
function qty(id,d){const e=cart.find(c=>c.id===id);if(e.c==='digital')return;e.q+=d;if(e.q<1)return del(id);save();drawCart()}
function save(){localStorage.setItem('cart',JSON.stringify(cart));cCount.textContent=cart.reduce((s,c)=>s+c.q,0)}
function tw(id){const i=wish.indexOf(id);i>-1?(wish.splice(i,1),showToast('أزيل من المفضلة')):(wish.push(id),showToast('أضيف للمفضلة ❤️'));
localStorage.setItem('wish',JSON.stringify(wish));wCount.textContent=wish.length;paint()}

function drawCart(){const b=cartBody,f=cartFoot;
if(!cart.length){b.innerHTML='<div class="empty"><i class="fas fa-shopping-cart"></i><h3>السلة فارغة</h3></div>';f.innerHTML='';return}
b.innerHTML=cart.map(c=>`<div class="citem"><div class="ci" ${c.c==='digital'?'style="background:rgba(14,165,233,.15);color:#0ea5e9"':''}>${c.img?`<img src="${c.img}">`:`<i class="${c.i}"></i>`}</div>
<div style="flex:1"><h4>${c.n}</h4><span style="color:var(--p);font-weight:700">${fmt(c.p*c.q)}</span>
${c.c==='digital'?'<div style="font-size:11px;color:#0ea5e9;margin-top:5px"><i class="fas fa-bolt"></i> تسليم فوري</div>':`<div class="qty"><button onclick="qty(${c.id},-1)">-</button><span>${c.q}</span><button onclick="qty(${c.id},1)">+</button></div>`}</div>
<button class="del" onclick="del(${c.id})"><i class="fas fa-trash-alt"></i></button></div>`).join('');
const sub=cart.reduce((s,c)=>s+c.p*c.q,0),allDig=cart.every(c=>c.c==='digital'),tot=sub-disc;
f.innerHTML=`<div class="coup"><input id="cIn" placeholder="كود الخصم"><button class="btn btn-o" onclick="coup()">تطبيق</button></div>
<div class="srow"><span>المجموع</span><span>${fmt(sub)}</span></div>
<div class="srow"><span>التوصيل</span><span>${allDig?'<b style="color:#0ea5e9">رقمي ⚡ مجاني</b>':'<small style="color:var(--g)">يُحسب حسب الولاية</small>'}</span></div>
${disc?`<div class="srow" style="color:#10b981"><span>الخصم</span><span>-${fmt(disc)}</span></div>`:''}
<div class="srow tot"><span>الإجمالي</span><span>${fmt(tot)}</span></div>
<button class="btn btn-p" style="width:100%;margin-top:10px" onclick="checkout()"><i class="fas fa-clipboard-check"></i> إتمام الطلب</button>
<button class="btn btn-w" style="width:100%;margin-top:8px" onclick="waCart()"><i class="fab fa-whatsapp"></i> اطلب عبر واتساب</button>`}
function coup(){const c=cIn.value.trim().toUpperCase(),m={SAVE10:10,SAVE20:20,SAVE50:50,WELCOME:15,DIGITAL30:30};
if(m[c]){disc=Math.round(cart.reduce((s,x)=>s+x.p*x.q,0)*m[c]/100);showToast(`خصم ${m[c]}% مُطبّق 🎉`);drawCart()}else showToast('كوبون غير صالح ❌')}
function openCart(){drawCart();cartD.classList.add('on');ov.classList.add('on')}
function openWish(){const L=P.filter(x=>wish.includes(x.id));
wishBody.innerHTML=L.length?L.map(x=>`<div class="citem"><div class="ci">${x.img?`<img src="${x.img}">`:`<i class="${x.i}"></i>`}</div>
<div style="flex:1"><h4>${x.n}</h4><span style="color:var(--p);font-weight:700">${fmt(x.p)}</span>
<button class="btn btn-p" style="padding:6px 12px;font-size:12px;margin-top:6px" onclick="add(${x.id})">أضف للسلة</button></div>
<button class="del" onclick="tw(${x.id});openWish()"><i class="fas fa-times"></i></button></div>`).join(''):'<div class="empty"><i class="fas fa-heart"></i><h3>لا توجد مفضلات</h3></div>';
wishD.classList.add('on');ov.classList.add('on')}
function closeAll(){document.querySelectorAll('.drawer').forEach(d=>d.classList.remove('on'));ov.classList.remove('on')}

/* ===== واتساب ===== */
function waOne(id){const x=P.find(p=>p.id===id);
const m=`مرحباً 👋%0Aأريد طلب هذا المنتج:%0A%0A📦 *${x.n}*%0A💰 السعر: ${x.p.toLocaleString('en-US')} ${CUR}%0A%0Aشكراً`;
open(`https://wa.me/${WA}?text=${m}`,'_blank')}
function waCart(){if(!cart.length)return showToast('السلة فارغة');
const sub=cart.reduce((s,c)=>s+c.p*c.q,0);
let m=`مرحباً 👋%0Aأريد طلب:%0A%0A`;
cart.forEach((c,i)=>{m+=`${i+1}. *${c.n}*%0A   الكمية: ${c.q} × ${c.p.toLocaleString('en-US')} ${CUR}%0A`});
m+=`%0A💰 *المجموع: ${(sub-disc).toLocaleString('en-US')} ${CUR}*`;
if(disc)m+=`%0A🎟️ الخصم: -${disc.toLocaleString('en-US')} ${CUR}`;
open(`https://wa.me/${WA}?text=${m}`,'_blank')}

/* ===== إرسال للـ CRM ===== */
function sendToCRM(order){
  if(!CRM_URL) return Promise.resolve();
  return fetch(CRM_URL,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(order)
  }).then(r=>r.json()).catch(()=>{
    const q=JSON.parse(localStorage.getItem('pending')||'[]');
    q.push(order);localStorage.setItem('pending',JSON.stringify(q));
  });
}

/* ===== إتمام الطلب ===== */
function checkout(){if(!cart.length)return showToast('السلة فارغة');closeAll();
const allDig=cart.every(c=>c.c==='digital');
coBody.innerHTML=`<h2 style="margin-bottom:12px"><i class="fas fa-${allDig?'bolt':'clipboard-check'}"></i> ${allDig?'استلام فوري':'معلومات التوصيل'}</h2>
${allDig?'<p style="color:#0ea5e9;font-size:13px;margin-bottom:12px">📩 سيصلك رابط التحميل على بريدك خلال دقائق</p>':''}
<form onsubmit="return done(event)">
<input class="inp" required id="fN" placeholder="الاسم الكامل *">
<input class="inp" required id="fP" type="tel" placeholder="رقم الهاتف *" pattern="0[567][0-9]{8}">
<input class="inp" ${allDig?'required':''} id="fE" type="email" placeholder="البريد الإلكتروني ${allDig?'*':'(اختياري)'}">
${allDig?'':`<select class="inp" required id="fW" onchange="calcD()"><option value="">اختر الولاية *</option>${W.map((w,i)=>`<option value="${i}">${String(i+1).padStart(2,'0')} - ${w[0]}</option>`).join('')}</select>
<div class="dlv"><label><input type="radio" name="dt" value="home" checked onchange="calcD()"><span>🏠 للمنزل</span><div id="pH" style="font-size:12px;color:var(--g);margin-top:3px">-</div></label>
<label><input type="radio" name="dt" value="desk" onchange="calcD()"><span>🏢 مكتب التوصيل</span><div id="pD" style="font-size:12px;color:var(--g);margin-top:3px">-</div></label></div>
<textarea class="inp" required id="fA" rows="2" placeholder="العنوان التفصيلي *"></textarea>`}
<div id="sumBox" style="background:var(--bg);padding:12px;border-radius:8px;margin-bottom:12px"></div>
<button class="btn btn-p" style="width:100%;${allDig?'background:#0ea5e9':''}"><i class="fas fa-check"></i> ${allDig?'تأكيد واستلام فوراً ⚡':'تأكيد الطلب'}</button>
<button type="button" class="btn btn-w" style="width:100%;margin-top:8px" onclick="waFull()"><i class="fab fa-whatsapp"></i> أرسل الطلب عبر واتساب</button>
</form>`;
calcD();document.getElementById('co').classList.add('on')}

function calcD(){const allDig=cart.every(c=>c.c==='digital');const sub=cart.reduce((s,c)=>s+c.p*c.q,0);
let ship=0;
if(!allDig){const w=document.getElementById('fW');
if(w&&w.value!==''){const wi=W[+w.value];document.getElementById('pH').textContent=wi[1]+' '+CUR;document.getElementById('pD').textContent=wi[2]+' '+CUR;
const dt=document.querySelector('input[name=dt]:checked').value;ship=dt==='home'?wi[1]:wi[2]}}
const tot=sub+ship-disc;
sumBox.innerHTML=`<div class="srow"><span>المنتجات</span><span>${fmt(sub)}</span></div>
<div class="srow"><span>التوصيل</span><span>${allDig?'<b style="color:#0ea5e9">مجاني ⚡</b>':(ship?fmt(ship):'—')}</span></div>
${disc?`<div class="srow" style="color:#10b981"><span>الخصم</span><span>-${fmt(disc)}</span></div>`:''}
<div class="srow tot" style="font-size:17px"><span>الإجمالي</span><span>${fmt(tot)}</span></div>`;
return{sub,ship,tot}}

function waFull(){const allDig=cart.every(c=>c.c==='digital');
const n=document.getElementById('fN').value||'—',p=document.getElementById('fP').value||'—';
const {sub,ship,tot}=calcD();
let m=`🛒 *طلب جديد*%0A%0A👤 الاسم: ${n}%0A📞 الهاتف: ${p}%0A`;
if(!allDig){const w=document.getElementById('fW');const a=document.getElementById('fA').value||'—';
m+=`📍 الولاية: ${w.value!==''?W[+w.value][0]:'—'}%0A🏠 العنوان: ${a}%0A🚚 النوع: ${document.querySelector('input[name=dt]:checked').value==='home'?'للمنزل':'مكتب التوصيل'}%0A`}
else{m+=`📧 البريد: ${document.getElementById('fE').value||'—'}%0A`}
m+=`%0A📦 *المنتجات:*%0A`;
cart.forEach((c,i)=>{m+=`${i+1}. ${c.n} × ${c.q} = ${(c.p*c.q).toLocaleString('en-US')} ${CUR}%0A`});
m+=`%0A💵 المنتجات: ${sub.toLocaleString('en-US')} ${CUR}%0A🚚 التوصيل: ${allDig?'مجاني':ship.toLocaleString('en-US')+' '+CUR}%0A`;
if(disc)m+=`🎟️ الخصم: -${disc.toLocaleString('en-US')} ${CUR}%0A`;
m+=`*💰 الإجمالي: ${tot.toLocaleString('en-US')} ${CUR}*`;
open(`https://wa.me/${WA}?text=${m}`,'_blank')}

function done(e){e.preventDefault();const allDig=cart.every(c=>c.c==='digital');
const {sub,ship,tot}=calcD();
const num='DZ-'+Math.random().toString(36).substr(2,6).toUpperCase();
const wEl=document.getElementById('fW');

const order={
  orderId:num,
  date:new Date().toISOString(),
  name:document.getElementById('fN').value,
  phone:document.getElementById('fP').value,
  email:(document.getElementById('fE')||{}).value||'',
  wilaya:(!allDig&&wEl&&wEl.value!=='')?((+wEl.value+1)+' - '+W[+wEl.value][0]):'رقمي',
  address:allDig?'منتج رقمي (تسليم فوري)':((document.getElementById('fA')||{}).value||''),
  delivery:allDig?'رقمي':(document.querySelector('input[name=dt]:checked').value==='home'?'للمنزل':'مكتب التوصيل'),
  products:cart.map(c=>c.n+' ×'+c.q).join(' | '),
  qty:cart.reduce((s,c)=>s+c.q,0),
  subtotal:sub,shipping:ship,discount:disc,total:tot,
  payment:allDig?'مسبق':'الدفع عند الاستلام',
  type:allDig?'digital':'physical'
};

const btn=e.target.querySelector('.btn-p');
if(btn){btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...'}

sendToCRM(order).finally(()=>{
coBody.innerHTML=`<div style="text-align:center;padding:22px">
<i class="fas fa-check-circle" style="font-size:64px;color:#10b981"></i>
<h2 style="color:#10b981;margin:14px 0">تم تأكيد طلبك! 🎉</h2>
<p>رقم الطلب: <b>${num}</b></p>
<p style="font-size:20px;font-weight:800;color:var(--p);margin:10px 0">${fmt(tot)}</p>
<p style="color:var(--g);margin-bottom:16px">${allDig?'📩 تحقق من بريدك — روابط التحميل في الطريق ⚡':'📞 سنتصل بك خلال 24 ساعة لتأكيد التوصيل'}</p>
<button class="btn btn-p" onclick="cls('co')">حسناً</button></div>`;
cart=[];disc=0;save();
});
return false}

function showToast(m){const t=toast;tMsg.textContent=m;t.classList.add('on');clearTimeout(t._x);t._x=setTimeout(()=>t.classList.remove('on'),2500)}

/* ===== الوضع الليلي ===== */
function toggleTheme(){const d=document.documentElement.getAttribute('data-t')==='dark';
document.documentElement.setAttribute('data-t',d?'light':'dark');
localStorage.setItem('theme',d?'light':'dark');
thBtn.innerHTML=`<i class="fas fa-${d?'moon':'sun'}"></i>`}
if(localStorage.getItem('theme')==='dark'){document.documentElement.setAttribute('data-t','dark');thBtn.innerHTML='<i class="fas fa-sun"></i>'}

let cs=0;const sl=document.querySelectorAll('.slide');
sl.forEach((_,i)=>{const d=document.createElement('i');if(!i)d.className='on';d.onclick=()=>go(i);dots.appendChild(d)});
function go(i){sl[cs].classList.remove('on');dots.children[cs].classList.remove('on');cs=i;sl[cs].classList.add('on');dots.children[cs].classList.add('on')}
setInterval(()=>go((cs+1)%sl.length),5000);
setInterval(()=>{const n=new Date(),e=new Date(n);e.setHours(23,59,59);const d=e-n;
hh.textContent=String(Math.floor(d/36e5)).padStart(2,'0');mm.textContent=String(Math.floor(d%36e5/6e4)).padStart(2,'0');ss.textContent=String(Math.floor(d%6e4/1e3)).padStart(2,'0')},1000);
onscroll=()=>up.classList.toggle('on',scrollY>300);
paint();save();wCount.textContent=wish.length;
if(innerWidth<680){const s=document.createElement('style');s.textContent='.pdg{grid-template-columns:1fr!important}';document.head.appendChild(s)}

// إعادة إرسال الطلبات المعلقة محلياً إن وجدت
(function(){const q=JSON.parse(localStorage.getItem('pending')||'[]');
if(q.length&&CRM_URL){localStorage.removeItem('pending');q.forEach(o=>sendToCRM(o))}})();
</script>
</body>
</html>
