import {
  createSignal,
  type Component,
  For,
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
  },
};

// --- Típusok ---
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

// --- Stílusok a szerkesztőhöz ---
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
  const saved = localStorage.getItem("ultra-final-v10");

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
          summary: "Ide írd a profilod...",
          expertise: ["TypeScript"],
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
    localStorage.setItem("ultra-final-v10", JSON.stringify(cv())),
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
    const newEntry: Entry = {
      id: Date.now(),
      title: "",
      subtitle: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
    };
    setCv({ ...cv(), [type]: [newEntry, ...cv()[type]] });
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
      {/* BAL PANEL: SZERKESZTŐ */}
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
            "align-items": "center",
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
              padding: "5px",
              "border-radius": "4px",
            }}
          >
            <option value="hu">HU 🇭🇺</option>
            <option value="en">EN 🇺🇸</option>
          </select>
        </div>

        {/* Stílus */}
        <div style={{ ...sectionBox, border: `1px solid ${cv().accentColor}` }}>
          <label style={labelStyle}>{t().fontLabel}</label>
          <select
            value={cv().fontFamily}
            onChange={(e) =>
              setCv({ ...cv(), fontFamily: e.currentTarget.value })
            }
            style={{ ...inputStyle, "margin-bottom": "10px" }}
          >
            <For each={fonts}>
              {(f) => <option value={f.value}>{f.name}</option>}
            </For>
          </select>
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

        {/* Fotó & Adatok */}
        <div style={sectionBox}>
          <label style={labelStyle}>{t().photoLabel}</label>
          <input
            type="file"
            onChange={handlePhotoUpload}
            style={{ "margin-bottom": "10px", "font-size": "12px" }}
          />
          <Show when={cv().photo}>
            <div
              style={{
                background: "#1a202c",
                padding: "10px",
                "border-radius": "6px",
                "margin-bottom": "10px",
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
          </Show>
          <label style={labelStyle}>{t().name}</label>
          <input
            value={cv().name}
            onInput={(e) => setCv({ ...cv(), name: e.currentTarget.value })}
            style={inputStyle}
          />
          <label style={labelStyle}>{t().role}</label>
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
            placeholder="LinkedIn link"
            style={{ ...inputStyle, "margin-top": "5px" }}
          />
        </div>

        <div style={sectionBox}>
          <label style={labelStyle}>{t().summaryTitle}</label>
          <textarea
            value={cv().summary}
            onInput={(e) => setCv({ ...cv(), summary: e.currentTarget.value })}
            style={{ ...inputStyle, height: "80px", resize: "none" }}
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
              <For each={cv()[type]}>
                {(entry) => (
                  <div
                    style={{
                      ...entryCard,
                      background: "#1a202c",
                      "margin-top": "10px",
                    }}
                  >
                    <button
                      onClick={() =>
                        setCv({
                          ...cv(),
                          [type]: cv()[type].filter((i) => i.id !== entry.id),
                        })
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
                      value={entry.title}
                      onInput={(e) =>
                        setCv({
                          ...cv(),
                          [type]: cv()[type].map((i) =>
                            i.id === entry.id
                              ? { ...i, title: e.currentTarget.value }
                              : i,
                          ),
                        })
                      }
                      style={inputStyle}
                    />
                    <input
                      type="month"
                      value={entry.startDate}
                      onInput={(e) =>
                        setCv({
                          ...cv(),
                          [type]: cv()[type].map((i) =>
                            i.id === entry.id
                              ? { ...i, startDate: e.currentTarget.value }
                              : i,
                          ),
                        })
                      }
                      style={{ ...inputStyle, "margin-top": "5px" }}
                    />
                    <Show when={!entry.isCurrent}>
                      <input
                        type="month"
                        value={entry.endDate}
                        onInput={(e) =>
                          setCv({
                            ...cv(),
                            [type]: cv()[type].map((i) =>
                              i.id === entry.id
                                ? { ...i, endDate: e.currentTarget.value }
                                : i,
                            ),
                          })
                        }
                        style={{ ...inputStyle, "margin-top": "5px" }}
                      />
                    </Show>
                    <label style={{ "font-size": "11px" }}>
                      <input
                        type="checkbox"
                        checked={entry.isCurrent}
                        onChange={(e) =>
                          setCv({
                            ...cv(),
                            [type]: cv()[type].map((i) =>
                              i.id === entry.id
                                ? { ...i, isCurrent: e.currentTarget.checked }
                                : i,
                            ),
                          })
                        }
                      />{" "}
                      {t().current}
                    </label>
                  </div>
                )}
              </For>
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

      {/* JOBB PANEL: ELŐNÉZET */}
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
              display: "flex",
              "align-items": "center",
              gap: "30px",
              "border-bottom": `4px solid ${cv().lineColor}`,
              "padding-bottom": "25px",
            }}
          >
            <Show when={cv().photo}>
              <div
                style={{
                  width: "120px",
                  height: "120px",
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
            <div>
              <h1
                style={{
                  margin: 0,
                  "font-size": "42px",
                  color: cv().accentColor,
                }}
              >
                {cv().name}
              </h1>
              <p
                style={{
                  "font-size": "22px",
                  color: cv().accentColor,
                  "font-weight": "bold",
                }}
              >
                {cv().role}
              </p>
              <div style={{ "font-size": "14px", color: "#64748b" }}>
                📧 {cv().email} | 📞 {cv().phone}
                <Show when={cv().linkedin}>
                  <span> | 🔗 {cv().linkedin.replace(/^https?:\/\//, "")}</span>
                </Show>
              </div>
            </div>
          </header>

          {/* 1. SZAKMAI PROFIL */}
          <section style={{ "margin-top": "30px" }}>
            <h3
              style={{
                color: cv().accentColor,
                "border-bottom": `1px solid ${cv().lineColor}`,
                "padding-bottom": "5px",
                "text-transform": "uppercase",
              }}
            >
              {t().summaryTitle}
            </h3>
            <p
              style={{
                "line-height": "1.6",
                margin: 0,
                "white-space": "pre-wrap",
              }}
            >
              {cv().summary}
            </p>
          </section>

          {/* 2. KÉSZSÉGEK */}
          <Show when={cv().expertise.length > 0}>
            <section style={{ "margin-top": "30px" }}>
              <h3
                style={{
                  color: cv().accentColor,
                  "border-bottom": `1px solid ${cv().lineColor}`,
                  "padding-bottom": "5px",
                  "text-transform": "uppercase",
                }}
              >
                {t().expertiseTitle}
              </h3>
              <div
                style={{
                  display: "flex",
                  "flex-wrap": "wrap",
                  gap: "8px",
                  "margin-top": "10px",
                }}
              >
                <For each={cv().expertise}>
                  {(s) => (
                    <span
                      style={{
                        border: `1px solid ${cv().accentColor}`,
                        padding: "4px 12px",
                        "border-radius": "15px",
                        "font-size": "13px",
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

          {/* 3. TAPASZTALAT & 4. TANULMÁNYOK */}
          <For each={["experience", "education"] as const}>
            {(type) => (
              <section style={{ "margin-top": "30px" }}>
                <h3
                  style={{
                    color: cv().accentColor,
                    "border-bottom": `1px solid ${cv().lineColor}`,
                    "padding-bottom": "5px",
                    "text-transform": "uppercase",
                  }}
                >
                  {type === "experience" ? t().expTitle : t().eduTitle}
                </h3>
                <For each={cv()[type]}>
                  {(entry) => (
                    <div style={{ "margin-bottom": "15px" }}>
                      <div
                        style={{
                          display: "flex",
                          "justify-content": "space-between",
                          "font-weight": "bold",
                        }}
                      >
                        <span>{entry.title}</span>
                        <span style={{ color: "#64748b" }}>
                          {entry.startDate} —{" "}
                          {entry.isCurrent ? t().current : entry.endDate}
                        </span>
                      </div>
                    </div>
                  )}
                </For>
              </section>
            )}
          </For>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@700&family=Roboto:wght@400;700&family=Courier+Prime:wght@400;700&display=swap');
        @page { size: auto; margin: 0mm; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; }
          main { padding: 0 !important; overflow: visible !important; }
          #cv-paper { box-shadow: none !important; width: 100% !important; margin: 0 !important; padding: 20mm !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
