
// ==================== 1. الإمساك بعناصر الواجهة الأساسية ====================
// جلب نموذج تسجيل الدخول بواسطة معرفه الفريد (id) من ملف HTML لربطه بحدث الإرسال لاحقاً
const loginForm = document.getElementById('loginForm');
// جلب حاوية صفحة تسجيل الدخول بأكملها للتحكم بإخفائها أو إظهارها برمجياً
const loginPage = document.getElementById('login-page');
// جلب حاوية لوحة التحكم الكبرى لإظهارها للمستخدم بعد التحقق من صلاحيات الدخول
const mainDashboard = document.getElementById('main-dashboard');
// جلب عنصر الفقرة المخصص لرسالة الخطأ لكتابة تنبيهات الأمان للمستخدم باللون الأحمر
const loginError = document.getElementById('loginError');
// جلب زر تسجيل الخروج لربطه بحدث الضغط لإعادة قفل النظام والعودة لشاشة البدء
const logoutBtn = document.getElementById('logoutBtn');

// جلب نموذج بوابة إصدار البطاقات لالتقاط بيانات المشترك الجديد عند الضغط على زر التوليد
const badgeForm = document.getElementById('badgeForm');
// جلب القسم المخصص لحقن وعرض كارت البطاقة الذكية الناتجة أمام الموظف
const badgeDisplaySection = document.getElementById('badge-display-section');
// جلب جسم الجدول (tbody) لحقن أسطر المشتركين الجدد برمجياً وتحديث القائمة
const membersTableBody = document.getElementById('membersTableBody');

// جلب مصفوفة الحاضرين المخزنة في متصفح المستخدم (localStorage) تحت الاسم الفريد 'membersData'
// دالة JSON.parse تحول النص المحفوظ إلى مصفوفة كائنات جافا سكريبت حقيقية، وفي حال كانت الذاكرة فارغة لأول مرة يتم إنشاء مصفوفة فارغة [] عبر المعامل المساعد ||
let membersDatabase = JSON.parse(localStorage.getItem('membersData')) || [];


// ==================== 2. إدارة جلسة تسجيل الدخول والخروج ====================
// إضافة مستمع لحدث إرسال نموذج الدخول (عند النقر على زر الدخول أو ضغط مفتاح Enter)
loginForm.addEventListener('submit', function (event) {
    // منع المتصفح من سلوكه الافتراضي وهو إعادة تحميل الصفحة (Refresh)، للحفاظ على حالة التطبيق والبيانات
    event.preventDefault();

    // التقاط القيمة المكتوبة داخل حقل اسم المستخدم مع مسح أي فراغات زائدة قد يكتبها المستخدم بالخطأ يميناً أو يساراً عبر .trim()
    const usernameInput = document.getElementById('username').value.trim();
    // التقاط القيمة السرية المكتوبة داخل حقل كلمة المرور بشكل دقيق وبدون مسح الفراغات
    const passwordInput = document.getElementById('password').value;

    // فحص الشرط الأمني الافتراضي المحدد للنظام (إذا كان اسم المستخدم admin وكلمة المرور 123)
    if (usernameInput === "admin" && passwordInput === "123") {
        // نجاح الدخول: يتم إضافة كلاس الإخفاء (hidden) لشاشة تسجيل الدخول لتختفي فوراً
        loginPage.classList.add('hidden');
        // إزالة كلاس الإخفاء (hidden) عن لوحة التحكم الكبرى لتباغت المستخدم بالظهور الفوري
        mainDashboard.classList.remove('hidden');
        // تصفير وتفريغ نص الخطأ الأحمر تماماً لكي لا يظهر مجدداً
        loginError.textContent = "";
        // استدعاء دالة التنقل switchSection لفتح التبويب الترحيبي الأول (home-section) مباشرة
        switchSection('home-section');
        // استدعاء دالة بناء وتعبئة جدول إدارة الأعضاء لعرض البيانات التي كانت محفوظة سابقاً في الذاكرة
        renderMembersTable();
    } else {
        // فشل الدخول: كتابة نص تحذيري داخل فقرة الخطأ في الـ HTML لتنبيه الموظف بالبيانات الصحيحة المسموحة
        loginError.textContent = "❌ البيانات غير صحيحة! جرب (admin / 123)";
    }
});

// إضافة مستمع لحدث الضغط على زر تسجيل الخروج لإعادة تأمين المنصة
logoutBtn.addEventListener('click', function () {
    // إعادة إخفاء لوحة التحكم الكبرى بإضافة كلاس الاختفاء (hidden) لها
    mainDashboard.classList.add('hidden');
    // إعادة إظهار شاشة تسجيل الدخول الأساسية بإزالة كلاس الاختفاء (hidden) عنها
    loginPage.classList.remove('hidden');
    // تصفير وإعادة تعيين حقول نموذج تسجيل الدخول (اسم المستخدم وكلمة المرور) لتصبح فارغة تماماً لعملية جديدة
    loginForm.reset();
});


// ==================== 3. معالجة وتوليد التذاكر والبطاقات الذكية ====================
// إضافة مستمع لحدث إرسال نموذج بوابة إصدار البطاقات الذكية للحاضرين
badgeForm.addEventListener('submit', function (event) {
    // منع المتصفح من إعادة تحميل الصفحة للحفاظ على مصفوفة البيانات المحلية والملفات المرفوعة جارية المعالجة
    event.preventDefault();

    // جلب قيم المدخلات من الحقول بواسطة معرفاتها (IDs) وحفظها في متغيرات ثابتة مع تنظيف الفراغات عبر .trim()
    const confName = document.getElementById('confName').value.trim();
    const fullName = document.getElementById('fullName').value.trim();
    const jobTitle = document.getElementById('jobTitle').value.trim();
    const skillsString = document.getElementById('skills').value.trim();
    const ticketType = document.getElementById('ticketType').value; // التقاط الخيار المحدد من القائمة (VIP أو Speaker أو Attendee)
    const photoInput = document.getElementById('attendeePhoto'); // الإمساك بعنصر رفع الملفات لقراءة الصورة المرفوعة برمجياً

    // توليد رقم عشوائي صحيح محصور بين 1000 و 9999 لضمان تفرد التذاكر وعدم تكرارها العشوائي في الفعالية
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    // دمج السلسلة النصية مع الرقم العشوائي لتشكيل الرقم التسلسلي الأمني والحصري لتذكرة الزائر
    const ticketSerialNumber = `CONF-2026-${randomNumber}`;

    // التحقق الأمني الفعلي مما إذا كان المستخدم قد قام باختيار ورفع ملف صورة حقيقي داخل حقل الرفع
    if (photoInput.files && photoInput.files[0]) {
        // إنشاء كائن قارئ ملفات جديد (FileReader) مدمج في المتصفح لقراءة وتشفير الملفات محلياً بدون خوادم
        const reader = new FileReader();

        // تجهيز حدث الاستماع (onload) الذي سيعمل ذاتياً فور نجاح القارئ من إتمام معالجة وتحويل ملف الصورة بنجاح
        reader.onload = function (e) {
            // الحصول على الكود النصي الطويل والمشفر الممثل للصورة بالكامل (Base64 Data URL) من نتيجة الحدث
            const photoBase64 = e.target.result;
            // استدعاء دالة الحفظ المركزيةsaveMember وتمرير كافة البيانات المستخرجة بالإضافة لكود الصورة المشفر
            saveMember(confName, fullName, jobTitle, skillsString, ticketType, ticketSerialNumber, photoBase64);
        };
        // إعطاء الأمر الفعلي للقارئ لبدء عملية تشفير وتحويل ملف الصورة المرفوع الأول [0] إلى سلسلة نصية طويلة (Data URL)
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        // في حال لم يتم رفع صورة وترك الحقل فارغاً، يتم استدعاء دالة الحفظ مباشرة وتمرير نص فارغ '' كممثل للصورة لتعتمد البطاقة أيقونة افتراضية
        saveMember(confName, fullName, jobTitle, skillsString, ticketType, ticketSerialNumber, '');
    }
});

// دالة حفظ كائن المشترك في الذاكرة المحلية وتوجيه الأوامر لتحديث الشاشات فوراُ
function saveMember(confName, fullName, jobTitle, skillsString, ticketType, serial, photo) {
    // بناء كائن جافا سكريبت موحد وممنهج يضم كافة تفاصيل الحاضر مع توليد معرف فريد (id) يعتمد على جزء من الثانية الحالية Date.now() لاستحالة تكراره
    const memberObject = {
        id: Date.now(),
        confName,
        fullName,
        jobTitle,
        skillsString,
        ticketType,
        serial,
        photo
    };

    // دفع وإضافة كائن العضو الجديد إلى نهاية مصفوفة قاعدة البيانات المحلية (membersDatabase) جارية العمل
    membersDatabase.push(memberObject);
    // تحديث السجل الشامل في الذاكرة المحلية للمتصفح (localStorage)، مع تحويل مصفوفة الكائنات إلى نص JSON لأن الذاكرة لا تقبل إلا نصوصاً
    localStorage.setItem('membersData', JSON.stringify(membersDatabase));

    // استدعاء دالة إعادة بناء جدول الحاضرين لتحديث البيانات وظهور السطر الجديد فوراً في لوحة التحكم
    renderMembersTable();
    // استدعاء دالة التوليد البصري displayBadge لحقن وبناء مجسم كارت البطاقة الذكية لهذا المشترك وعرضه على الشاشة
    displayBadge(memberObject);
    // تصفير وإعادة تهيئة كافة حقول نموذج بوابة إصدار البطاقات ليكون فارغاً وجاهزاً لإدخال بيانات زائر جديد تماماً
    badgeForm.reset();
}

// دالة بناء التكوين الهيكلي البصري للبطاقة الذكية وحقن بيانات المشترك بداخلها ديناميكياً
function displayBadge(member) {
    // إنشاء متغير نصي تجميعي فارغ لبناء كود الـ HTML الداخلي الخاص بوسوم المهارات
    let skillsHTML = '';

    // فحص ما إذا كان العضو يمتلك سلسلة نصوص مهارات تم إدخالها في الحقل الخاص بها
    if (member.skillsString) {
        // تقطيع السلسلة النصية للمهارات وتحويلها لمصفوفة حقيقية عن طريق فصل الكلمات عند كل فاصلة (,) ثم عمل حلقة تكرار .forEach عليها مهارة مهارة
        member.skillsString.split(',').forEach(skill => {
            // التحقق من أن اسم المهارة بعد مسح الفراغات الجانبية لا يمثل سطراً أو نصاً فارغاً
            if (skill.trim() !== "") {
                // صياغة وسم span يحمل كلاس التنسيق الدائري المستدير (skill-tag) وحقن اسم المهارة بداخل وتجميعها في المتغير التراكمي
                skillsHTML += `<span class="skill-tag">${skill.trim()}</span>`;
            }
        });
    }

    // تحديد اللون المميز الافتراضي لرأس وحدود البطاقة الذكية (اللون الكحلي الداكن المخصص للحضور العادي)
    let headerColor = '#1a365d';
    // شرط: إذا كانت فئة تذكرة المشترك VIP يتم تحويل وترقية اللون برمجياً إلى اللون الذهبي الفاخر ليميز كبار الشخصيات
    if (member.ticketType === 'VIP') headerColor = '#d69e2e';
    // شرط فرعي: أما إذا كانت فئة التذكرة Speaker (متحدث) يتم تحويل اللون إلى اللون الفيروزي المشرق المميز للخطباء
    else if (member.ticketType === 'Speaker') headerColor = '#319795';

    // استخدام المعامل الشرطي المختصر (Ternary Operator) لفحص ما إذا كان المشترك يمتلك كود صورة مشفرة
    const userPhotoHTML = member.photo ?
        `<img src="${member.photo}" alt="صورة">` : // إذا وُجدت الصورة، يتم صياغة وسم img بحقن كود البايس64 مباشرة في مسار الـ src الخاص بها
        `<span style="font-size: 50px; color: #a0aec0;">👤</span>`; // إذا لم توجد صورة، يتم وضع أيقونة مستخدم تعبيرية افتراضية رمادية الحجم

    // تفريغ محتوى حاوية العرض في الـ HTML تماماً وحقن كود الـ HTML المتكامل والضخم لمجسم الهيكل الفيزيائي للبطاقة الذكية بداخلها برمجياً
    badgeDisplaySection.innerHTML = `
        <div class="badge-card">
            <div class="badge-header" style="background-color: ${headerColor};">
                <h3>بطاقة حضور رسمية</h3>
                <p>${member.confName}</p> </div>
            <div class="badge-body">
                <div class="badge-avatar" style="border: 3px solid ${headerColor};">
                    ${userPhotoHTML} </div>
                <h2 style="color: #1a365d; margin-bottom: 5px;">${member.fullName}</h2> <p style="color: #4a5568; font-weight: 500; margin-bottom: 12px;">${member.jobTitle}</p> <div class="badge-skills">${skillsHTML || '<span class="skill-tag">مشارك</span>'}</div>
                
                <hr style="margin: 20px 0; border: 0; border-top: 2px dashed #cbd5e0;"> <div class="ticket-info" style="text-align: right; background: #f7fafc; padding: 15px; border-radius: 8px;">
                    <p style="margin-bottom: 6px;"><strong>نوع الفئة:</strong> <span style="color: ${headerColor}; font-weight: bold;">${member.ticketType}</span></p>
                    <p style="margin-bottom: 0;"><strong>رقم التذكرة الأمني:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${member.serial}</code></p>
                </div>
                
                <div class="barcode-mock"></div> <small style="color: #a0aec0; font-size: 11px; display: block; margin-top: 5px;">نظام التحقق الرقمي الذكي - المنظمة</small>
                
                <button onclick="window.print()" style="margin-top: 20px; background-color: #4a5568; color: white; 
                padding: 10px; border: none; width: 100%; border-radius: 5px; cursor: pointer;
                font-weight: bold;" class="no-print">🖨️ طباعة وحفظ التذكرة فقط</button>
            </div>
        </div>
    `;

    // سحب وانتزاع كلاس الاختفاء (hidden) عن حاوية العرض لتنبثق البطاقة الذكية وتظهر أمام عين المستخدم فوراً
    badgeDisplaySection.classList.remove('hidden');
    // أمر برمجي متطور يجبر المتصفح على تحريك عجلة التمرير (Scroll) تلقائياً نحو الأسفل ليركز نظر المستخدم على مكان البطاقة المتولدة بانسيابية
    badgeDisplaySection.scrollIntoView({ behavior: 'smooth' });
}


// ==================== 4. إدارة الأعضاء وعرض الجدول الإحصائي ====================
// دالة مسؤولة عن قراءة المصفوفة وبناء جدول مرئي تفاعلي داخل قسم سجل الحاضرين بالكامل
function renderMembersTable() {
    // تصفير وتفريغ محتوى الجدول تماماً ومسح كافة الأسطر القديمة لتجنب تراكم أو تكرار البيانات عند كل تحديث جديد
    membersTableBody.innerHTML = '';

    // فحص شرطي: ما إذا كانت مصفوفة قاعدة البيانات المحلية فارغة تماماً ولا تحتوي على أي زوار مسجلين حتى الآن
    if (membersDatabase.length === 0) {
        // حقن سطر واحد عريض يمتد على الـ 7 أعمدة بالكامل (colspan="7") يعرض نصاً رمادياً مريحاً يفيد بعدم وجود أي سجلات مصدرة
        membersTableBody.innerHTML = `<tr><td colspan="7" style="padding: 15px;
        text-align: center; color: #a0aec0;">لا يوجد سجلات مصدرة حالياً.</td></tr>`;
        return; // قطع وإنهاء تنفيذ الدالة فوراً لأن الجدول فارغ ولا توجد كائنات لعمل حلقة تكرار عليها
    }

    // في حال وجود بيانات مسجلة، نقوم بعمل حلقة تكرار شاملة (forEach) لزيارة كائن كل زائر مسجل (member) مع معرفة موقعه في المصفوفة (index)
    membersDatabase.forEach((member, index) => {
        // إنشاء عنصر سطر جدول جديد (TableRow) برمجياً في ذاكرة المتصفح قبل حقنه
        const row = document.createElement('tr');
        // إضافة حد سفلي رمادي فاصل لكل سطر لحفظ التناسق والتنظيم الجمالي للجدول
        row.style.borderBottom = '1px solid #cbd5e0';

        // تجهيز مظهر الصورة المصغرة للجدول: إن كانت موجودة نضعها في وسم img دائري صغير ومتناسق، وإلا نكتفي بوضع أيقونة المستخدم الافتراضية 👤
        const photoTd = member.photo ?
            `<img src="${member.photo}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">` : '👤';

        // تحديد لون وسم الفئة داخل الجدول ديناميكياً ليطابق تماماً ألوان البطاقات المعتمدة لحفظ الهوية البصرية المنظمة للمشروع
        let catColor = '#1a365d';
        // إذا كان نوع الحاضر VIP يأخذ وسم الجدول صبغة اللون الذهبي
        if (member.ticketType === 'VIP') catColor = '#d69e2e';
        // أما إذا كان نوع الحاضر متحدث يأخذ صبغة اللون التركوازي المشرق
        else if (member.ticketType === 'Speaker') catColor = '#319795';

        // حقن كود الأعمدة السبعة التفصيلية داخل السطر، مع تمرير المعرف الفريد الزمني ${member.id} داخل أزرار التحكم (عرض / حذف)
        row.innerHTML = `
            <td style="padding: 10px; text-align: center; border: 1px solid #cbd5e0;">${photoTd}</td>
            <td style="padding: 10px; border: 1px solid #cbd5e0; font-weight: bold;">${member.fullName}</td>
            <td style="padding: 10px; border: 1px solid #cbd5e0; color: #4a5568;">${member.confName}</td>
            <td style="padding: 10px; border: 1px solid #cbd5e0;">${member.jobTitle}</td>
            <td style="padding: 10px; border: 1px solid #cbd5e0; text-align: center;"><span class="skill-tag" style="background-color: ${catColor}; color: white;">${member.ticketType}</span></td>
            <td style="padding: 10px; border: 1px solid #cbd5e0; font-family: monospace;">${member.serial}</td>
            <td style="padding: 10px; border: 1px solid #cbd5e0; text-align: center;">
                <button onclick="viewMember(${member.id})" style="background-color: #3182ce;
                color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; margin-left: 5px;
                width: auto;">عرض</button>
                <button onclick="deleteMember(${member.id})" style="background-color: #e53e3e;
                color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer;
                width: auto;">حذف</button>
            </td>
        `;
        // إلصاق وحقن السطر المتكامل والمبني حديثاً داخل جسم الجدول في صفحة الـ HTML ليظهر أمام المستخدم فوراً
        membersTableBody.appendChild(row);
    });
}

// دالة مسؤولة عن حذف سجل حاضر معين بشكل نهائي وقاطع من الذاكرة والنظام
function deleteMember(id) {
    // إظهار نافذة تأكيدية منبثقة من المتصفح (Confirm Box) لمنع عمليات الحذف غير المقصودة بالخطأ من الموظف
    if (confirm("هل أنت متأكد من رغبتك في حذف سجل هذا الحاضر نهائياً؟")) {
        // فلترة المصفوفة: إعادة بناء المصفوفة من جديد والاحتفاظ بكافة المشتركين باستثناء المشترك الذي يتطابق الـ id الخاص به مع الـ id الممرر للدالة
        membersDatabase = membersDatabase.filter(m => m.id !== id);
        // تحديث قاعدة بيانات المتصفح (localStorage) بالنسخة الجديدة المفلترة بعد مسح العضو وحفظ المصفوفة كنص JSON
        localStorage.setItem('membersData', JSON.stringify(membersDatabase));
        // إعادة استدعاء دالة بناء الجدول لتحديث الشاشة فوراً واختفاء السطر الممسوح من أمام عين المستخدم
        renderMembersTable();
        // إخفاء قسم عرض البطاقة الذكية تحسباً لكون البطاقة المحذوفة هي المعروضة حالياً على الشاشة لمنع التضارب البصري
        badgeDisplaySection.classList.add('hidden');
    }
}

// دالة مخصصة للبحث عن حاضر معين بواسطة معرّفه الفريد وإعادة توليد بطاقته الذكية لاستعراضها
function viewMember(id) {
    // استخدام دالة البحث المدمجة في الجافا سكريبت (.find) للوصول إلى كائن المشترك الذي يطابق معرّفه الرقم الممرر للدالة
    const member = membersDatabase.find(m => m.id === id);
    // شرط: في حال عثرت الدالة على الحاضر بنجاح وتأكدت من وجود كائن بياناته في المصفوفة
    if (member) {
        // نمرر كائن بيانات الحاضر بالكامل لدالة التوليد المركزية displayBadge لتقوم ببناء وعرض كارت تذكرته الذكية فوراً
        displayBadge(member);
    }
}


// ==================== 5. محرك دالة التنقل الفوري بين الواجهات الأربعة ====================
// الدالة السحرية المسؤولة عن تحويل لوحة التحكم لتطبيق صفحة واحدة تفاعلي (SPA) عبر إخفاء وإظهار الأقسام ديناميكياً
function switchSection(sectionId) {
    // جلب جميع العناصر في الصفحة التي تحمل الكلاس المشترك .dashboard-section (وهي الأقسام الأربعة الرئيسية للمنصة)
    const allSections = document.querySelectorAll('.dashboard-section');
    // عمل حلقة تكرار سريعة لإضافة كلاس الاختفاء (hidden) لكافة الأقسام بلا استثناء لتصفير الشاشة تماماً وإخلائها
    allSections.forEach(sec => {
        sec.classList.add('hidden');
    });

    // تأمين بصري: إخفاء حاوية عرض البطاقة الناتجة مؤقتاً عند التبديل بين التبويبات إلا لو كان القسم المطلوب فتحه هو نفسه قسم عرض البطاقة
    if (sectionId !== 'badge-display-section') {
        badgeDisplaySection.classList.add('hidden');
    }

    // جلب وحفظ القسم المستهدف المطلوب الانتقال إليه والوصول إليه عبر معرّفه الفريد الممرر للدالة (sectionId)
    const target = document.getElementById(sectionId);
    // في حال تم التحقق البرمجي من وجود هذا القسم المستهدف داخل مستند الـ HTML بنجاح
    if (target) {
        // نقوم بانتزاع وإزالة كلاس الاختفاء (hidden) عنه ليظهر بمفرده وبشكل رائع ومهيكل في لوحة التحكم
        target.classList.remove('hidden');
    }
}
// ==================== الوضع الليلي ====================

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

    const isDark =
        document.body.classList.contains("dark-mode");

    localStorage.setItem("darkMode", isDark);

    const darkBtn =
       document.getElementById("darkModeBtn")       

    darkBtn.textContent =
        isDark
            ? "☀️ الوضع النهاري"
            : "🌙 الوضع الليلي";
}


