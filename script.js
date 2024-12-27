// متغیرهای عمومی
let currentCategory = '';
let currentQuestion = {};
let score = 0;
let currentLanguage = 'en'; // زبان پیش‌فرض انگلیسی
let currentDifficulty = 'easy'; // پیش‌فرض سختی سوالات (آسان)

// ترجمه متون به زبان‌های مختلف
const translations = {
    en: {
        title: 'Math Challenge',
        subtitle: 'Choose a category to start solving challenges!',
        addition: 'Addition',
        subtraction: 'Subtraction',
        multiplication: 'Multiplication',
        division: 'Division',
        submit: 'Submit',
        back: 'Back to Main',
        next: 'Next Question',
        correct: 'Correct! 🎉',
        wrong: 'Wrong! The correct answer was',
        answerNotValid: 'Please enter a valid number.',  // اضافه کردن پیغام برای ورودی نادرست
    },
    fa: {
        title: 'چالش ریاضی',
        subtitle: 'یک دسته‌بندی انتخاب کنید و چالش‌ها را حل کنید!',
        addition: 'جمع',
        subtraction: 'تفریق',
        multiplication: 'ضرب',
        division: 'تقسیم',
        submit: 'ثبت',
        back: 'بازگشت به صفحه اصلی',
        next: 'سوال بعدی',
        correct: 'درست است! 🎉',
        wrong: 'اشتباه! پاسخ درست بود',
        answerNotValid: 'لطفاً یک عدد معتبر وارد کنید.',  // اضافه کردن پیغام برای ورودی نادرست
    }
};

// تغییر زبان
function changeLanguage() {
    currentLanguage = document.getElementById('language-selector').value;
    const texts = translations[currentLanguage];

    const elementsToTranslate = {
        title: 'title',
        subtitle: 'subtitle',
        btnAddition: 'btn-addition',
        btnSubtraction: 'btn-subtraction',
        btnMultiplication: 'btn-multiplication',
        btnDivision: 'btn-division',
        btnSubmit: 'btn-submit',
        btnBack: 'btn-back',
        btnBackResult: 'btn-back-result',
        btnNext: 'btn-next',
    };

    for (const [key, id] of Object.entries(elementsToTranslate)) {
        document.getElementById(id).textContent = texts[key] || texts[key.toLowerCase()];
    }
}

// شروع چالش
function startChallenge(category) {
    currentCategory = category;
    document.querySelector('.categories').classList.add('hidden');
    document.getElementById('challenge').classList.remove('hidden');
    nextQuestion();
}

// تولید سوال
function generateQuestion() {
    let min, max;
    switch (currentDifficulty) {
        case 'easy': [min, max] = [1, 20]; break;
        case 'medium': [min, max] = [10, 50]; break;
        case 'hard': [min, max] = [50, 100]; break;
    }

    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num2 = Math.floor(Math.random() * (max - min + 1)) + min;

    switch (currentCategory) {
        case 'addition': return { question: `${num1} + ${num2}`, answer: num1 + num2 };
        case 'subtraction': return { question: `${num1} - ${num2}`, answer: num1 - num2 };
        case 'multiplication': return { question: `${num1} × ${num2}`, answer: num1 * num2 };
        case 'division': return { question: `${num1 * num2} ÷ ${num2}`, answer: num1 };
    }
}

// نمایش سوال جدید
function nextQuestion() {
    currentQuestion = generateQuestion();
    document.getElementById('question').textContent = currentQuestion.question;
    document.getElementById('answer').value = '';
    document.getElementById('result').classList.add('hidden');
    document.getElementById('challenge').classList.remove('hidden');
}

// بررسی پاسخ کاربر
function checkAnswer() {
    const userAnswer = parseFloat(document.getElementById('answer').value);
    const feedback = document.getElementById('feedback');
    const texts = translations[currentLanguage];

    // بررسی اینکه ورودی عددی باشد
    if (isNaN(userAnswer)) {
        feedback.textContent = `${texts.wrong} ${texts.answerNotValid}`;
        document.getElementById('result').classList.remove('hidden');
        document.getElementById('challenge').classList.add('hidden');
        return;
    }

    // بررسی پاسخ درست یا غلط
    if (userAnswer === currentQuestion.answer) {
        feedback.textContent = texts.correct;
        score += (currentDifficulty === 'easy' ? 1 : 2);
    } else {
        feedback.textContent = `${texts.wrong} ${currentQuestion.answer}.`;
    }

    displayScore();

    document.getElementById('result').classList.remove('hidden');
    document.getElementById('challenge').classList.add('hidden');

    // پس از نمایش نتیجه، سوال بعدی را نشان دهیم
    setTimeout(nextQuestion, 1500);  // بعد از 1.5 ثانیه، سوال بعدی نمایش داده می‌شود

    if (score >= 10) { // پایان بازی پس از کسب امتیاز مشخص
        alert(`${texts.title} Complete! Final Score: ${score}`);
        goBack();
    }
}

// نمایش امتیاز
function displayScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
    saveScore();
}

// ذخیره امتیاز
function saveScore() {
    localStorage.setItem('mathChallengeScore', score);
}

// بارگذاری امتیاز
function loadScore() {
    score = parseInt(localStorage.getItem('mathChallengeScore')) || 0;
    displayScore();
}

// بازگشت به صفحه اصلی
function goBack() {
    document.querySelector('.categories').classList.remove('hidden');
    document.getElementById('challenge').classList.add('hidden');
    document.getElementById('result').classList.add('hidden');
    currentCategory = '';
    score = 0;
    displayScore(); // بازنشانی امتیاز
}

// بارگذاری امتیاز از localStorage هنگام بارگذاری صفحه
window.onload = loadScore;
