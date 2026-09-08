/* =========================
   XP SYSTEM
========================= */

let xp =
  Number(
    localStorage.getItem("mirathiXP") || 0
  );

document.getElementById("xp")
  .textContent = xp;


/* =========================
   PAGE NAVIGATION
========================= */

const tabs =
  document.querySelectorAll(".tab");

const pages =
  document.querySelectorAll(".page");


tabs.forEach(tab => {

  tab.addEventListener("click", () => {

    tabs.forEach(t =>
      t.classList.remove("active")
    );

    pages.forEach(p =>
      p.classList.remove("active")
    );

    tab.classList.add("active");

    document
      .getElementById(tab.dataset.page)
      .classList.add("active");

  });

});


/* =========================
   HELPERS
========================= */

function gcd(a,b) {

  while(b) {

    let temp = a % b;

    a = b;

    b = temp;

  }

  return a;
}


function lcm(a,b) {

  return a / gcd(a,b) * b;

}


function step(title,text) {

  return `
    <div class="step">
      <b>${title}</b>
      <br>
      ${text}
    </div>
  `;

}


/* =========================
   SOLVER
========================= */

const names = {

  husband:"الزوج",

  wife:"الزوجة",

  son:"الابن",

  daughter:"البنت",

  father:"الأب",

  mother:"الأم",

  fullBrother:"الأخ الشقيق",

  fullSister:"الأخت الشقيقة",

  maternalBrother:"الأخ لأم",

  maternalSister:"الأخت لأم",

  grandmother:"الجدة"

};


document
  .getElementById("solveBtn")
  .addEventListener("click", solve);


function solve() {

  const h = {};

  document
    .querySelectorAll("[data-heir]")
    .forEach(input => {

      h[input.dataset.heir] =
        input.checked;

    });


  const estate =
    Number(
      document.getElementById("estate").value || 0
    );


  const selected =
    Object.keys(h)
      .filter(k => h[k]);


  if(selected.length === 0) {

    document.getElementById("result")
      .innerHTML =
      step(
        "⚠️ تنبيه",
        "اختار وارثًا واحدًا على الأقل."
      );

    return;

  }


  if(h.husband && h.wife) {

    document.getElementById("result")
      .innerHTML =
      step(
        "⚠️ خطأ",
        "لا يجتمع الزوج والزوجة في مسألة واحدة."
      );

    return;

  }


  let output = "";


  output += step(
    "1️⃣ تحديد الورثة",
    selected
      .map(k => names[k])
      .join("، ")
  );


  /* =====================
     الحجب
  ===================== */

  let blocked = [];


  if(h.son) {

    if(h.fullBrother) {

      blocked.push("الأخ الشقيق");

      h.fullBrother = false;

    }

    if(h.fullSister) {

      blocked.push("الأخت الشقيقة");

      h.fullSister = false;

    }

    if(h.maternalBrother) {

      blocked.push("الأخ لأم");

      h.maternalBrother = false;

    }

    if(h.maternalSister) {

      blocked.push("الأخت لأم");

      h.maternalSister = false;

    }

  }


  if(h.father) {

    if(h.fullBrother) {

      blocked.push("الأخ الشقيق");

      h.fullBrother = false;

    }

    if(h.fullSister) {

      blocked.push("الأخت الشقيقة");

      h.fullSister = false;

    }

  }


  if(blocked.length) {

    output += step(
      "2️⃣ الحجب",
      `المحجوبون: ${blocked.join("، ")}`
    );

  } else {

    output += step(
      "2️⃣ الحجب",
      "لا يوجد حجب حرمان ظاهر في هذه الحالة التدريبية."
    );

  }


  /* =====================
     الفروض
  ===================== */

  let shares = [];


  /* الزوج */

  if(h.husband) {

    if(h.son || h.daughter) {

      shares.push({
        name:"الزوج",
        n:1,
        d:4
      });

    } else {

      shares.push({
        name:"الزوج",
        n:1,
        d:2
      });

    }

  }


  /* الزوجة */

  if(h.wife) {

    if(h.son || h.daughter) {

      shares.push({
        name:"الزوجة",
        n:1,
        d:8
      });

    } else {

      shares.push({
        name:"الزوجة",
        n:1,
        d:4
      });

    }

  }


  /* الأم */

  if(h.mother) {

    const siblings =
      (h.maternalBrother ? 1 : 0) +
      (h.maternalSister ? 1 : 0) +
      (h.fullBrother ? 1 : 0) +
      (h.fullSister ? 1 : 0);


    if(
      h.son ||
      h.daughter ||
      siblings >= 2
    ) {

      shares.push({
        name:"الأم",
        n:1,
        d:6
      });

    } else {

      shares.push({
        name:"الأم",
        n:1,
        d:3
      });

    }

  }


  /* الأب */

  if(h.father && h.son) {

    shares.push({
      name:"الأب",
      n:1,
      d:6
    });

  }


  /* البنت */

  if(h.daughter && !h.son) {

    shares.push({
      name:"البنت",
      n:1,
      d:2
    });

  }


  /* الأخت الشقيقة */

  if(
    h.fullSister &&
    !h.son &&
    !h.father &&
    !h.fullBrother &&
    !h.daughter
  ) {

    shares.push({
      name:"الأخت الشقيقة",
      n:1,
      d:2
    });

  }


  /* الإخوة لأم */

  if(
    (h.maternalBrother ||
    h.maternalSister) &&
    !h.son &&
    !h.daughter &&
    !h.father
  ) {

    const count =
      (h.maternalBrother ? 1 : 0) +
      (h.maternalSister ? 1 : 0);


    if(count === 1) {

      shares.push({
        name:
          h.maternalBrother
            ? "الأخ لأم"
            : "الأخت لأم",

        n:1,
        d:6

      });

    } else {

      shares.push({
        name:"الإخوة لأم",
        n:1,
        d:3

      });

    }

  }


  /* الجدة */

  if(h.grandmother && !h.mother) {

    shares.push({

      name:"الجدة",

      n:1,

      d:6

    });

  }


  /* =====================
     عرض الفروض
  ===================== */

  if(shares.length) {

    output += step(
      "3️⃣ تحديد الفروض",

      shares
        .map(
          s =>
            `${s.name}: ${s.n}/${s.d}`
        )
        .join("<br>")
    );

  }


  /* =====================
     أصل المسألة
  ===================== */

  let root = 1;


  shares.forEach(s => {

    root =
      lcm(root,s.d);

  });


  let units = 0;


  shares.forEach(s => {

    units +=
      root *
      s.n /
      s.d;

  });


  units =
    Math.round(units * 1000) / 1000;


  output += step(
    "4️⃣ أصل المسألة",
    `أصل المسألة = ${root}`
  );


  /* =====================
     العول
  ===================== */

  let finalRoot = root;

  let awl = false;


  if(units > root) {

    awl = true;

    finalRoot =
      Math.ceil(units);


    output += step(
      "5️⃣ العَول",
      `زادت الأسهم عن أصل المسألة، فأصبحت المسألة من ${finalRoot}.`
    );

  } else {

    output += step(
      "5️⃣ العَول",
      "لا يوجد عَول في هذه الحالة."
    );

  }


  /* =====================
     الباقي
  ===================== */

  let used = 0;


  shares.forEach(s => {

    used +=
      finalRoot *
      s.n /
      s.d;

  });


  let remainder =
    finalRoot - used;


  /* =====================
     العصبة
  ===================== */

  let residuary = [];


  if(h.son) {

    if(h.daughter) {

      residuary.push({
        name:"الابن",
        ratio:2
      });

      residuary.push({
        name:"البنت",
        ratio:1
      });

    } else {

      residuary.push({
        name:"الابن",
        ratio:1
      });

    }

  }

  else if(
    h.father &&
    !h.son
  ) {

    residuary.push({
      name:"الأب",
      ratio:1
    });

  }

  else if(
    h.fullBrother &&
    !h.father
  ) {

    residuary.push({
      name:"الأخ الشقيق",
      ratio:1
    });

  }


  if(
    remainder > 0 &&
    residuary.length
  ) {

    output += step(
      "6️⃣ العصبة",
      "يوجد عاصب يأخذ الباقي."
    );

  }

  else if(
    remainder > 0
  ) {

    output += step(
      "6️⃣ الرد",
      "يوجد باقٍ بعد أصحاب الفروض ولا يوجد عاصب؛ فيُنظر في أحكام الرد."
    );

  }


  /* =====================
     النتيجة
  ===================== */

  output += `
    <div class="card result-table">

      <h3>
        📊 النتيجة
      </h3>
  `;


  shares.forEach(s => {

    const shareUnits =
      finalRoot *
      s.n /
      s.d;


    let money = 0;


    if(estate > 0) {

      money =
        estate *
        shareUnits /
        finalRoot;

    }


    output += `

      <div class="share">

        <span>
          ${s.name}
        </span>

        <b>

          ${shareUnits}
          سهم

          ${
            estate > 0
              ? ` — ${money.toLocaleString("ar-EG",{
                  maximumFractionDigits:2
                })} جنيه`
              : ""
          }

        </b>

      </div>

    `;

  });


  output += `</div>`;


  if(awl) {

    output += `

      <div class="step warning">

        ⚠️
        أصل المسألة:
        ${root}

        <br>

        وبعد العَول:
        ${finalRoot}

      </div>

    `;

  }


  document.getElementById("result")
    .innerHTML = output;


  /* XP */

  xp += 10;

  localStorage.setItem(
    "mirathiXP",
    xp
  );

  document.getElementById("xp")
    .textContent = xp;

}


/* =========================
   QUIZ
========================= */

const questions = [

  {

    q:
      "كم عدد الفروض المقدرة؟",

    answers:
      [
        "خمسة",
        "ستة",
        "سبعة",
        "ثمانية"
      ],

    correct:1,

    explain:
      "الفروض المقدرة ستة: النصف، الربع، الثمن، الثلثان، الثلث، السدس."

  },


  {

    q:
      "ما أسباب الإرث؟",

    answers:
      [
        "القرابة والنكاح والولاء",
        "العمل فقط",
        "الوصية فقط",
        "النكاح فقط"
      ],

    correct:0,

    explain:
      "أسباب الإرث المذكورة في الكتاب: القرابة، النكاح، الولاء."

  },


  {

    q:
      "ما هو أصل المسألة؟",

    answers:
      [
        "عدد الورثة",
        "المضاعف البسيط للمقامات",
        "قيمة التركة",
        "نصيب الابن"
      ],

    correct:1,

    explain:
      "أصل المسألة هو المضاعف البسيط للمقامات."

  },


  {

    q:
      "متى يحدث العَول؟",

    answers:
      [
        "عندما تزيد الأسهم على أصل المسألة",
        "عندما لا يوجد ورثة",
        "عند وجود وصية",
        "عند وجود ابن"
      ],

    correct:0,

    explain:
      "العَول يكون عند زيادة أسهم أصحاب الفروض على المقدار الأصلي."

  },


  {

    q:
      "كم نوعًا للعصبة؟",

    answers:
      [
        "نوع واحد",
        "نوعان",
        "ثلاثة أنواع",
        "أربعة"
      ],

    correct:2,

    explain:
      "العصبة ثلاثة: عاصب بنفسه، عاصب بغيره، عاصب مع غيره."

  },


  {

    q:
      "ما نصيب الزوج عند عدم وجود فرع وارث؟",

    answers:
      [
        "النصف",
        "الربع",
        "الثمن",
        "السدس"
      ],

    correct:0,

    explain:
      "الزوج له النصف عند عدم وجود الفرع الوارث."

  },


  {

    q:
      "ما نصيب الزوجة مع وجود فرع وارث؟",

    answers:
      [
        "النصف",
        "الربع",
        "الثمن",
        "الثلث"
      ],

    correct:2,

    explain:
      "الزوجة لها الثمن عند وجود الفرع الوارث."

  },


  {

    q:
      "ما الحد الأقصى للوصية الواجبة؟",

    answers:
      [
        "النصف",
        "الثلث",
        "الربع",
        "السدس"
      ],

    correct:1,

    explain:
      "الكتاب يذكر أن الوصية الواجبة لا تتجاوز الثلث."

  }

];


let currentQuestion = 0;


function showQuestion() {

  const q =
    questions[currentQuestion];


  document.getElementById("qCount")
    .textContent =
    `${currentQuestion + 1} / ${questions.length}`;


  document.getElementById("qText")
    .textContent = q.q;


  document.getElementById("answers")
    .innerHTML =
    q.answers
      .map(
        (answer,index) => `

          <button
            class="answer"
            data-index="${index}"
          >

            ${answer}

          </button>

        `
      )
      .join("");


  document.getElementById("explain")
    .innerHTML = "";


  document.getElementById("nextBtn")
    .style.display = "none";


  document
    .querySelectorAll(".answer")
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          checkAnswer(
            Number(button.dataset.index)
          )
      );

    });

}


function checkAnswer(index) {

  const q =
    questions[currentQuestion];


  const buttons =
    document.querySelectorAll(".answer");


  buttons.forEach(
    b => b.disabled = true
  );


  buttons[q.correct]
    .classList.add("correct");


  if(index !== q.correct) {

    buttons[index]
      .classList.add("wrong");

  } else {

    xp += 5;

    localStorage.setItem(
      "mirathiXP",
      xp
    );

    document.getElementById("xp")
      .textContent = xp;

  }


  document.getElementById("explain")
    .innerHTML =

    index === q.correct

      ? `✅ إجابة صحيحة!<br>${q.explain}`

      : `❌ إجابة غير صحيحة.<br>${q.explain}`;


  document.getElementById("nextBtn")
    .style.display = "inline-block";

}


document
  .getElementById("nextBtn")
  .addEventListener(
    "click",
    () => {

      currentQuestion++;

      if(
        currentQuestion >=
        questions.length
      ) {

        currentQuestion = 0;

      }

      showQuestion();

    }
  );


showQuestion();
