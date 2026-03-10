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
    linkedin: "LinkedIn link",
    summaryTitle: "Szakmai profil",
    expertiseTitle: "Készségek",
    expTitle: "Szakmai tapasztalat",
    eduTitle: "Tanulmányok",
    photoLabel: "Profilkép",
    photoDelete: "✕ Törlés",
    zoom: "Nagyítás",
    posX: "X",
    posY: "Y",
    addBtn: "Hozzáadás",
    current: "Jelenlegi",
    printBtn: "PDF Mentése",
    placeholderTitle: "Cég / Iskola",
    placeholderSub: "Munkakör / Szak",
    placeholderSkill: "Új készség...",
    styleTitle: "Megjelenés",
    fontLabel: "Betűtípus",
    fontSizeLabel: "Betűméret",
    textColor: "Szöveg színe",
    lineColor: "Vonal színe",
    dataMgmt: "Adatkezelés",
    saveFile: "Mentés fájlba",
    loadFile: "Betöltés",
    privacyNote:
      "Adatvédelem: Az adatok csak a böngésződben tárolódnak (LocalStorage), nem gyűjtünk és nem továbbítunk semmit.",
  },
  en: {
    title: "CV Editor",
    name: "Full Name",
    role: "Job Title",
    email: "Email",
    phone: "Phone",
    linkedin: "LinkedIn link",
    summaryTitle: "Profile",
    expertiseTitle: "Skills",
    expTitle: "Experience",
    eduTitle: "Education",
    photoLabel: "Photo",
    photoDelete: "✕ Delete",
    zoom: "Zoom",
    posX: "X",
    posY: "Y",
    addBtn: "Add New",
    current: "Present",
    printBtn: "Save as PDF",
    placeholderTitle: "Company / School",
    placeholderSub: "Role / Degree",
    placeholderSkill: "New skill...",
    styleTitle: "Style",
    fontLabel: "Font",
    fontSizeLabel: "Font Size",
    textColor: "Text Color",
    lineColor: "Line Color",
    dataMgmt: "Data",
    saveFile: "Save",
    loadFile: "Load",
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
  fontSize: number;
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
  const saved = localStorage.getItem("cv-pro-v12-final-fix");

  const [cv, setCv] = createSignal<CVData>(
    saved
      ? JSON.parse(saved)
      : {
          name: "-",
          role: "-",
          email: "-",
          phone: "+3630-",
          linkedin: "",
          photo: null,
          photoSettings: { scale: 1.2, x: 0, y: 0 },
          summary: "",
          expertise: [],
          education: [],
          experience: [],
          lang: "hu",
          fontFamily: '"Inter", sans-serif',
          fontSize: 14,
          accentColor: "#3b82f6",
          lineColor: "#3b82f6",
        },
  );

  const t = () => translations[cv().lang];
  createEffect(() =>
    localStorage.setItem("cv-pro-v12-final-fix", JSON.stringify(cv())),
  );

  const handlePhotoUpload = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setCv({ ...cv(), photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

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

  const importData = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          setCv(JSON.parse(event.target?.result as string));
        } catch (err) {
          alert("Hiba!");
        }
      };
      reader.readAsText(file);
    }
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

        {/* --- STÍLUS BEÁLLÍTÁSOK --- */}
        <div style={sectionBox}>
          <label style={labelStyle}>{t().styleTitle}</label>
          <div style={{ "margin-bottom": "15px" }}>
            <label style={labelStyle}>{t().fontLabel}</label>
            <select
              value={cv().fontFamily}
              onChange={(e) =>
                setCv({ ...cv(), fontFamily: e.currentTarget.value })
              }
              style={inputStyle}
            >
              <For each={fonts}>
                {(f) => <option value={f.value}>{f.name}</option>}
              </For>
            </select>
          </div>
          <div style={{ "margin-bottom": "15px" }}>
            <label style={labelStyle}>
              {t().fontSizeLabel} ({cv().fontSize}px)
            </label>
            <input
              type="range"
              min="10"
              max="20"
              step="0.5"
              value={cv().fontSize}
              onInput={(e) =>
                setCv({ ...cv(), fontSize: parseFloat(e.currentTarget.value) })
              }
              style={{ width: "100%" }}
            />
          </div>
          <div
            style={{
              display: "grid",
              "grid-template-columns": "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <label style={labelStyle}>{t().textColor}</label>
              <input
                type="color"
                value={cv().accentColor}
                onInput={(e) =>
                  setCv({ ...cv(), accentColor: e.currentTarget.value })
                }
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t().lineColor}</label>
              <input
                type="color"
                value={cv().lineColor}
                onInput={(e) =>
                  setCv({ ...cv(), lineColor: e.currentTarget.value })
                }
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        {/* --- ADATKEZELÉS --- */}
        <div style={sectionBox}>
          <label style={labelStyle}>{t().dataMgmt}</label>
          <div style={{ display: "flex", gap: "5px" }}>
            <button
              onClick={exportData}
              style={{ ...buttonStyle, background: "#3b82f6", flex: 1 }}
            >
              📥 {t().saveFile}
            </button>
            <label
              style={{
                ...buttonStyle,
                background: "#64748b",
                flex: 1,
                "text-align": "center",
                cursor: "pointer",
              }}
            >
              📤 {t().loadFile}
              <input
                type="file"
                accept=".json"
                onChange={importData}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        {/* Alapadatok szekció */}
        <div style={sectionBox}>
          <label style={labelStyle}>{t().photoLabel}</label>
          <input
            type="file"
            onChange={handlePhotoUpload}
            style={{ "margin-bottom": "10px" }}
          />
          <Show when={cv().photo}>
            <div
              style={{
                background: "#1a202c",
                padding: "10px",
                "border-radius": "6px",
              }}
            >
              <button
                onClick={() => setCv({ ...cv(), photo: null })}
                style={{
                  ...buttonStyle,
                  background: "#ef4444",
                  width: "100%",
                  "margin-bottom": "5px",
                }}
              >
                {t().photoDelete}
              </button>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={cv().photoSettings.scale}
                onInput={(e) =>
                  setCv({
                    ...cv(),
                    photoSettings: {
                      ...cv().photoSettings,
                      scale: parseFloat(e.currentTarget.value),
                    },
                  })
                }
                style={{ width: "100%" }}
              />
              <div style={{ display: "flex", gap: "5px" }}>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={cv().photoSettings.x}
                  onInput={(e) =>
                    setCv({
                      ...cv(),
                      photoSettings: {
                        ...cv().photoSettings,
                        x: parseInt(e.currentTarget.value),
                      },
                    })
                  }
                  style={{ width: "100%" }}
                />
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={cv().photoSettings.y}
                  onInput={(e) =>
                    setCv({
                      ...cv(),
                      photoSettings: {
                        ...cv().photoSettings,
                        y: parseInt(e.currentTarget.value),
                      },
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </Show>
          <label style={{ ...labelStyle, "margin-top": "10px" }}>
            {t().name}
          </label>
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
          <input
            value={cv().email}
            onInput={(e) => setCv({ ...cv(), email: e.currentTarget.value })}
            placeholder="Email"
            style={{ ...inputStyle, "margin-top": "5px" }}
          />
          <input
            value={cv().phone}
            onInput={(e) => setCv({ ...cv(), phone: e.currentTarget.value })}
            placeholder="Telefon"
            style={{ ...inputStyle, "margin-top": "5px" }}
          />
          <input
            value={cv().linkedin}
            onInput={(e) => setCv({ ...cv(), linkedin: e.currentTarget.value })}
            placeholder="LinkedIn"
            style={{ ...inputStyle, "margin-top": "5px" }}
          />
        </div>

        <div style={sectionBox}>
          <label style={labelStyle}>{t().summaryTitle}</label>
          <textarea
            value={cv().summary}
            onInput={(e) => setCv({ ...cv(), summary: e.currentTarget.value })}
            style={{ ...inputStyle, height: "100px", resize: "none" }}
          />
        </div>

        <div style={sectionBox}>
          <label style={labelStyle}>{t().expertiseTitle}</label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newSkill()) {
                setCv({ ...cv(), expertise: [...cv().expertise, newSkill()] });
                setNewSkill("");
              }
            }}
            style={{ display: "flex", gap: "5px" }}
          >
            <input
              value={newSkill()}
              onInput={(e) => setNewSkill(e.currentTarget.value)}
              placeholder={t().placeholderSkill}
              style={inputStyle}
            />
            <button style={{ ...buttonStyle, background: cv().accentColor }}>
              +
            </button>
          </form>
          <div
            style={{
              display: "flex",
              "flex-wrap": "wrap",
              gap: "5px",
              "margin-top": "10px",
            }}
          >
            <For each={cv().expertise}>
              {(s, i) => (
                <span
                  onClick={() =>
                    setCv({
                      ...cv(),
                      expertise: cv().expertise.filter((_, idx) => idx !== i()),
                    })
                  }
                  style={{
                    background: "#334155",
                    padding: "4px 8px",
                    "border-radius": "4px",
                    "font-size": "12px",
                    cursor: "pointer",
                  }}
                >
                  {s} ✕
                </span>
              )}
            </For>
          </div>
        </div>

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
                        cursor: "pointer",
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
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        "margin-top": "5px",
                      }}
                    >
                      <input
                        type="month"
                        value={entry().startDate}
                        onInput={(e) => {
                          const val = e.currentTarget.value;
                          setCv((prev) => {
                            const newList = [...prev[type]];
                            newList[i] = { ...newList[i], startDate: val };
                            return { ...prev, [type]: newList };
                          });
                        }}
                        style={inputStyle}
                      />
                      <Show when={!entry().isCurrent}>
                        <input
                          type="month"
                          value={entry().endDate}
                          onInput={(e) => {
                            const val = e.currentTarget.value;
                            setCv((prev) => {
                              const newList = [...prev[type]];
                              newList[i] = { ...newList[i], endDate: val };
                              return { ...prev, [type]: newList };
                            });
                          }}
                          style={inputStyle}
                        />
                      </Show>
                    </div>
                    <label
                      style={{
                        "font-size": "11px",
                        "margin-top": "5px",
                        display: "block",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={entry().isCurrent}
                        onChange={(e) => {
                          const val = e.currentTarget.checked;
                          setCv((prev) => {
                            const newList = [...prev[type]];
                            newList[i] = { ...newList[i], isCurrent: val };
                            return { ...prev, [type]: newList };
                          });
                        }}
                      />{" "}
                      {t().current}
                    </label>
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
            "margin-bottom": "10px",
          }}
        >
          {t().printBtn}
        </button>

        {/* --- ADATVÉDELMI SZÖVEG --- */}
        <div
          style={{
            "margin-top": "10px",
            "font-size": "10px",
            color: "#94a3b8",
            "text-align": "center",
            "line-height": "1.4",
          }}
        >
          {t().privacyNote}
        </div>
      </aside>

      {/* --- ELŐNÉZET --- */}
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
            height: "fit-content",
            background: "white",
            padding: "20mm",
            color: "#1e293b",
            "font-family": cv().fontFamily,
            "font-size": `${cv().fontSize}px`,
            "box-shadow": "0 10px 25px rgba(0,0,0,0.1)",
            position: "relative",
          }}
        >
          <header
            style={{
              display: "flex",
              "align-items": "center",
              gap: "30px",
              "border-bottom": `4px solid ${cv().lineColor}`,
              "padding-bottom": "20px",
            }}
          >
            <Show when={cv().photo}>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  "border-radius": "50%",
                  border: `3px solid ${cv().lineColor}`,
                  overflow: "hidden",
                }}
              >
                <img
                  src={cv().photo!}
                  style={{
                    width: "100%",
                    height: "100%",
                    "object-fit": "cover",
                    transform: `scale(${cv().photoSettings.scale}) translate(${cv().photoSettings.x}%, ${cv().photoSettings.y}%)`,
                  }}
                />
              </div>
            </Show>
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  margin: 0,
                  "font-size": "2.5em",
                  color: cv().accentColor,
                }}
              >
                {cv().name}
              </h1>
              <p
                style={{
                  "font-size": "1.2em",
                  "font-weight": "bold",
                  margin: "5px 0",
                }}
              >
                {cv().role}
              </p>
              <div style={{ "font-size": "0.9em", color: "#64748b" }}>
                {cv().email} | {cv().phone}
                <Show when={cv().linkedin}>
                  <span> | {cv().linkedin.replace(/^https?:\/\//, "")}</span>
                </Show>
              </div>
            </div>
          </header>

          <section style={{ "margin-top": "20px" }}>
            <h3
              style={{
                color: cv().accentColor,
                "border-bottom": `1px solid ${cv().lineColor}`,
                "text-transform": "uppercase",
                "font-size": "1.1em",
              }}
            >
              {t().summaryTitle}
            </h3>
            <p
              style={{
                "white-space": "pre-wrap",
                margin: 0,
                "font-size": "1em",
                "line-height": "1.5",
              }}
            >
              {cv().summary}
            </p>
          </section>

          <Show when={cv().expertise.length > 0}>
            <section style={{ "margin-top": "20px" }}>
              <h3
                style={{
                  color: cv().accentColor,
                  "border-bottom": `1px solid ${cv().lineColor}`,
                  "text-transform": "uppercase",
                  "font-size": "1.1em",
                }}
              >
                {t().expertiseTitle}
              </h3>
              <div
                style={{
                  display: "flex",
                  "flex-wrap": "wrap",
                  gap: "6px",
                  "margin-top": "8px",
                }}
              >
                <For each={cv().expertise}>
                  {(s) => (
                    <span
                      style={{
                        border: `1px solid ${cv().accentColor}`,
                        padding: "3px 10px",
                        "border-radius": "15px",
                        "font-size": "0.85em",
                        color: cv().accentColor,
                      }}
                    >
                      {s}
                    </span>
                  )}
                </For>
              </div>
            </section>
          </Show>

          <For each={["experience", "education"] as const}>
            {(type) => (
              <section style={{ "margin-top": "20px" }}>
                <h3
                  style={{
                    color: cv().accentColor,
                    "border-bottom": `1px solid ${cv().lineColor}`,
                    "text-transform": "uppercase",
                    "font-size": "1.1em",
                  }}
                >
                  {type === "experience" ? t().expTitle : t().eduTitle}
                </h3>
                <For each={cv()[type]}>
                  {(item) => (
                    <div style={{ "margin-bottom": "12px" }}>
                      <div
                        style={{
                          display: "flex",
                          "justify-content": "space-between",
                          "font-weight": "bold",
                          "font-size": "1em",
                        }}
                      >
                        <span>{item.title}</span>
                        <span style={{ color: "#64748b" }}>
                          {item.startDate} —{" "}
                          {item.isCurrent ? t().current : item.endDate}
                        </span>
                      </div>
                      <div
                        style={{
                          color:
                            type === "experience"
                              ? cv().accentColor
                              : "inherit",
                          "font-size": "0.9em",
                        }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  )}
                </For>
              </section>
            )}
          </For>

          {/* Nyomtatási határvonal */}
          <div
            class="no-print"
            style={{
              position: "absolute",
              top: "277mm",
              left: 0,
              right: 0,
              border: "2px dashed #ef4444",
              "pointer-events": "none",
              "z-index": 100,
            }}
          >
            <span
              style={{
                background: "#ef4444",
                color: "white",
                "font-size": "11px",
                padding: "2px 8px",
                "font-weight": "bold",
              }}
            >
              PRINT CUTOFF
            </span>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@700&family=Roboto:wght@400;700&family=Courier+Prime:wght@400;700&display=swap');
        @page { size: A4; margin: 0; }
        @media print { 
            .no-print { display: none !important; } 
            body { background: white !important; margin: 0 !important; } 
            main { padding: 0 !important; overflow: visible !important; } 
            #cv-paper { 
              width: 210mm !important;
              height: 297mm !important;
              box-shadow: none !important; 
              margin: 0 !important; 
              padding: 20mm !important; 
              box-sizing: border-box;
              font-size: ${cv().fontSize}px !important;
            } 
        }
      `}</style>
    </div>
  );
};

export default App;
