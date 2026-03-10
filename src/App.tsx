import {
  createSignal,
  type Component,
  For,
  Index,
  createEffect,
  Show,
} from "solid-js";

// --- Nyelvi szótár ---
const translations = {
  hu: {
    title: "CV Szerkesztő",
    name: "Név",
    role: "Pozíció",
    email: "Email",
    phone: "Telefon",
    linkedin: "LinkedIn link (opcionális)",
    summaryTitle: "Szakmai profil",
    expertiseTitle: "Készségek",
    expTitle: "Szakmai tapasztalat",
    eduTitle: "Tanulmányok",
    photoLabel: "Profilkép feltöltése",
    photoDelete: "✕ Kép törlése",
    zoom: "Nagyítás",
    posX: "Vízszintes",
    posY: "Függőleges",
    addBtn: "Hozzáadás",
    current: "Jelenlegi",
    printBtn: "PDF Mentése",
    placeholderTitle: "Cég / Iskola",
    placeholderSub: "Munkakör / Szak",
    placeholderSkill: "Új készség...",
    styleTitle: "Megjelenés",
    fontLabel: "Betűtípus",
    textColor: "Szöveg színe",
    lineColor: "Vonal színe",
    dataMgmt: "Adatkezelés",
    saveFile: "Mentés fájlba",
    loadFile: "Betöltés",
    privacyNote:
      "Adatvédelem: Az adatok csak a böngésződben tárolódnak (LocalStorage), nem gyűjtünk semmit.",
  },
  en: {
    title: "CV Editor",
    name: "Full Name",
    role: "Job Title",
    email: "Email",
    phone: "Phone",
    linkedin: "LinkedIn link (optional)",
    summaryTitle: "Professional Profile",
    expertiseTitle: "Skills",
    expTitle: "Work Experience",
    eduTitle: "Education",
    photoLabel: "Upload Photo",
    photoDelete: "✕ Delete Photo",
    zoom: "Zoom",
    posX: "Horizontal",
    posY: "Vertical",
    addBtn: "Add New",
    current: "Present",
    printBtn: "Save as PDF",
    placeholderTitle: "Company / School",
    placeholderSub: "Role / Degree",
    placeholderSkill: "New skill...",
    styleTitle: "Style Settings",
    fontLabel: "Font Style",
    textColor: "Text Color",
    lineColor: "Line Color",
    dataMgmt: "Data Management",
    saveFile: "Save to file",
    loadFile: "Load file",
    privacyNote:
      "Privacy: Data is stored locally in your browser (LocalStorage); we do not collect any data.",
  },
};

interface Entry {
  id: number;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}
interface CVData {
  name: string;
  role: string;
  email: string;
  phone: string;
  linkedin: string;
  photo: string | null;
  photoSettings: { scale: number; x: number; y: number };
  summary: string;
  expertise: string[];
  education: Entry[];
  experience: Entry[];
  lang: "hu" | "en";
  fontFamily: string;
  accentColor: string;
  lineColor: string;
}

const fonts = [
  { name: "Modern (Inter)", value: '"Inter", sans-serif' },
  { name: "Elegáns (Playfair)", value: '"Playfair Display", serif' },
  { name: "Klasszikus (Roboto)", value: '"Roboto", sans-serif' },
  { name: "Írógép (Courier)", value: '"Courier Prime", monospace' },
];

const labelStyle = {
  "font-size": "11px",
  "font-weight": "bold",
  color: "#94a3b8",
  "text-transform": "uppercase",
  display: "block",
  "margin-bottom": "4px",
};
const inputStyle = {
  width: "100%",
  padding: "10px",
  background: "#0f172a",
  border: "1px solid #334155",
  color: "white",
  "border-radius": "6px",
  outline: "none",
  "box-sizing": "border-box" as any,
};
const sectionBox = {
  background: "#2d3748",
  padding: "15px",
  "border-radius": "10px",
  "margin-bottom": "20px",
};
const entryCard = {
  background: "#1a202c",
  padding: "12px",
  "border-radius": "8px",
  "margin-top": "10px",
  position: "relative" as const,
};
const buttonStyle = {
  border: "none",
  color: "white",
  padding: "5px 12px",
  "border-radius": "4px",
  cursor: "pointer",
  "font-weight": "bold",
};

const App: Component = () => {
  const [newSkill, setNewSkill] = createSignal("");
  const saved = localStorage.getItem("cv-pro-fixed-focus");

  const [cv, setCv] = createSignal<CVData>(
    saved
      ? JSON.parse(saved)
      : {
          name: "Kovács János",
          role: "Szoftverfejlesztő",
          email: "janos@pelda.hu",
          phone: "+36 30 123 4567",
          linkedin: "",
          photo: null,
          photoSettings: { scale: 1.2, x: 0, y: 0 },
          summary: "",
          expertise: [],
          education: [],
          experience: [],
          lang: "hu",
          fontFamily: '"Inter", sans-serif',
          accentColor: "#3b82f6",
          lineColor: "#3b82f6",
        },
  );

  const t = () => translations[cv().lang];
  createEffect(() =>
    localStorage.setItem("cv-pro-fixed-focus", JSON.stringify(cv())),
  );

  const addEntry = (type: "education" | "experience") => {
    setCv((prev) => ({
      ...prev,
      [type]: [
        {
          id: Date.now(),
          title: "",
          subtitle: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
        },
        ...prev[type],
      ],
    }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(cv(), null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const a = document.createElement("a");
    a.href = dataUri;
    a.download = `cv_${cv().lang}.json`;
    a.click();
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0f172a",
        "font-family": "Inter, sans-serif",
      }}
    >
      <aside
        class="no-print"
        style={{
          width: "450px",
          background: "#1e293b",
          padding: "25px",
          "overflow-y": "auto",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            "justify-content": "space-between",
            "margin-bottom": "20px",
          }}
        >
          <h2 style={{ color: cv().accentColor, margin: 0 }}>{t().title}</h2>
          <select
            value={cv().lang}
            onChange={(e) =>
              setCv({ ...cv(), lang: e.currentTarget.value as "hu" | "en" })
            }
            style={{
              background: "#0f172a",
              color: "white",
              border: "1px solid #334155",
            }}
          >
            <option value="hu">HU 🇭🇺</option>
            <option value="en">EN 🇺🇸</option>
          </select>
        </div>

        {/* Adatkezelés & Megjelenés (Rövidítve a helytakarékosság miatt) */}
        <div style={sectionBox}>
          <button
            onClick={exportData}
            style={{ ...buttonStyle, background: "#3b82f6", width: "100%" }}
          >
            📥 {t().saveFile}
          </button>
          <div
            style={{
              "margin-top": "10px",
              display: "grid",
              "grid-template-columns": "1fr 1fr",
              gap: "5px",
            }}
          >
            <input
              type="color"
              value={cv().accentColor}
              onInput={(e) =>
                setCv({ ...cv(), accentColor: e.currentTarget.value })
              }
            />
            <input
              type="color"
              value={cv().lineColor}
              onInput={(e) =>
                setCv({ ...cv(), lineColor: e.currentTarget.value })
              }
            />
          </div>
        </div>

        {/* Alapadatok - Itt nincs For, nem ugrik a fókusz */}
        <div style={sectionBox}>
          <label style={labelStyle}>{t().name}</label>
          <input
            value={cv().name}
            onInput={(e) => setCv({ ...cv(), name: e.currentTarget.value })}
            style={inputStyle}
          />
          <label style={{ ...labelStyle, "margin-top": "10px" }}>
            {t().role}
          </label>
          <input
            value={cv().role}
            onInput={(e) => setCv({ ...cv(), role: e.currentTarget.value })}
            style={inputStyle}
          />
        </div>

        {/* Szakmai profil */}
        <div style={sectionBox}>
          <label style={labelStyle}>{t().summaryTitle}</label>
          <textarea
            value={cv().summary}
            onInput={(e) => setCv({ ...cv(), summary: e.currentTarget.value })}
            style={{ ...inputStyle, height: "80px" }}
          />
        </div>

        {/* LISTÁK JAVÍTOTT RENDERELÉSE (Index használata a For helyett) */}
        <For each={["experience", "education"] as const}>
          {(type) => (
            <div style={sectionBox}>
              <div
                style={{ display: "flex", "justify-content": "space-between" }}
              >
                <h3 style={{ margin: 0 }}>
                  {type === "experience" ? t().expTitle : t().eduTitle}
                </h3>
                <button
                  onClick={() => addEntry(type)}
                  style={{ ...buttonStyle, background: cv().accentColor }}
                >
                  +
                </button>
              </div>

              <Index each={cv()[type]}>
                {(entry, i) => (
                  <div style={entryCard}>
                    <button
                      onClick={() =>
                        setCv((prev) => ({
                          ...prev,
                          [type]: prev[type].filter((_, idx) => idx !== i),
                        }))
                      }
                      style={{
                        position: "absolute",
                        right: "5px",
                        top: "5px",
                        color: "#ef4444",
                        background: "none",
                        border: "none",
                      }}
                    >
                      ✕
                    </button>

                    <input
                      placeholder={t().placeholderTitle}
                      value={entry().title}
                      onInput={(e) => {
                        const val = e.currentTarget.value;
                        setCv((prev) => {
                          const newList = [...prev[type]];
                          newList[i] = { ...newList[i], title: val };
                          return { ...prev, [type]: newList };
                        });
                      }}
                      style={inputStyle}
                    />

                    <input
                      placeholder={t().placeholderSub}
                      value={entry().subtitle}
                      onInput={(e) => {
                        const val = e.currentTarget.value;
                        setCv((prev) => {
                          const newList = [...prev[type]];
                          newList[i] = { ...newList[i], subtitle: val };
                          return { ...prev, [type]: newList };
                        });
                      }}
                      style={{ ...inputStyle, "margin-top": "5px" }}
                    />
                  </div>
                )}
              </Index>
            </div>
          )}
        </For>

        <button
          onClick={() => window.print()}
          style={{
            ...buttonStyle,
            background: "#10b981",
            width: "100%",
            padding: "15px",
          }}
        >
          {t().printBtn}
        </button>
      </aside>

      {/* ELŐNÉZET */}
      <main
        style={{
          flex: 1,
          background: "#e2e8f0",
          padding: "40px",
          overflow: "auto",
          display: "flex",
          "justify-content": "center",
        }}
      >
        <div
          id="cv-paper"
          style={{
            width: "210mm",
            "min-height": "297mm",
            background: "white",
            padding: "60px",
            color: "#1e293b",
            "font-family": cv().fontFamily,
          }}
        >
          <header
            style={{
              "border-bottom": `4px solid ${cv().lineColor}`,
              "padding-bottom": "20px",
            }}
          >
            <h1
              style={{
                margin: 0,
                color: cv().accentColor,
                "font-size": "40px",
              }}
            >
              {cv().name}
            </h1>
            <p style={{ "font-size": "20px", "font-weight": "bold" }}>
              {cv().role}
            </p>
          </header>

          <section style={{ "margin-top": "20px" }}>
            <h3
              style={{
                color: cv().accentColor,
                "border-bottom": "1px solid #ddd",
              }}
            >
              {t().summaryTitle}
            </h3>
            <p style={{ "white-space": "pre-wrap" }}>{cv().summary}</p>
          </section>

          <For each={["experience", "education"] as const}>
            {(type) => (
              <section style={{ "margin-top": "20px" }}>
                <h3
                  style={{
                    color: cv().accentColor,
                    "border-bottom": "1px solid #ddd",
                  }}
                >
                  {type === "experience" ? t().expTitle : t().eduTitle}
                </h3>
                <For each={cv()[type]}>
                  {(item) => (
                    <div style={{ "margin-bottom": "10px" }}>
                      <div style={{ "font-weight": "bold" }}>{item.title}</div>
                      <div style={{ color: "#666" }}>{item.subtitle}</div>
                    </div>
                  )}
                </For>
              </section>
            )}
          </For>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
        @media print { .no-print { display: none; } main { padding: 0; } #cv-paper { width: 100%; padding: 15mm; } }
      `}</style>
    </div>
  );
};

export default App;
