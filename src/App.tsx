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

// --- Segédkomponens a fókusz megtartásához ---
const DebouncedInput = (props: {
  value: string;
  onUpdate: (val: string) => void;
  placeholder?: string;
  style?: any;
  type?: string;
}) => {
  return (
    <input
      type={props.type || "text"}
      value={props.value}
      placeholder={props.placeholder}
      onInput={(e) => props.onUpdate(e.currentTarget.value)}
      style={props.style}
    />
  );
};

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
  const saved = localStorage.getItem("cv-pro-final-v3");

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
    localStorage.setItem("cv-pro-final-v3", JSON.stringify(cv())),
  );

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

  const updateEntry = (
    type: "education" | "experience",
    id: number,
    field: keyof Entry,
    value: any,
  ) => {
    setCv((prev) => ({
      ...prev,
      [type]: prev[type].map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(cv(), null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", `cv_data_${cv().lang}.json`);
    linkElement.click();
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
            }}
          >
            <option value="hu">HU 🇭🇺</option>
            <option value="en">EN 🇺🇸</option>
          </select>
        </div>

        {/* Adatkezelés */}
        <div style={{ ...sectionBox, border: "1px dashed #4ade80" }}>
          <label style={labelStyle}>{t().dataMgmt}</label>
          <div style={{ display: "flex", gap: "10px", "margin-top": "10px" }}>
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

        {/* Megjelenés */}
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

        {/* Személyes adatok */}
        <div style={sectionBox}>
          <label style={labelStyle}>{t().photoLabel}</label>
          <input
            type="file"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () =>
                  setCv({ ...cv(), photo: reader.result as string });
                reader.readAsDataURL(file);
              }
            }}
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
          <DebouncedInput
            value={cv().name}
            onUpdate={(val) => setCv({ ...cv(), name: val })}
            style={inputStyle}
          />
          <label style={{ ...labelStyle, "margin-top": "10px" }}>
            {t().role}
          </label>
          <DebouncedInput
            value={cv().role}
            onUpdate={(val) => setCv({ ...cv(), role: val })}
            style={inputStyle}
          />
          <DebouncedInput
            value={cv().email}
            onUpdate={(val) => setCv({ ...cv(), email: val })}
            placeholder="Email"
            style={{ ...inputStyle, "margin-top": "5px" }}
          />
          <DebouncedInput
            value={cv().phone}
            onUpdate={(val) => setCv({ ...cv(), phone: val })}
            placeholder="Telefon"
            style={{ ...inputStyle, "margin-top": "5px" }}
          />
          <DebouncedInput
            value={cv().linkedin}
            onUpdate={(val) => setCv({ ...cv(), linkedin: val })}
            placeholder="LinkedIn"
            style={{ ...inputStyle, "margin-top": "5px" }}
          />
        </div>

        {/* Profil */}
        <div style={sectionBox}>
          <label style={labelStyle}>{t().summaryTitle}</label>
          <textarea
            value={cv().summary}
            onInput={(e) => setCv({ ...cv(), summary: e.currentTarget.value })}
            style={{ ...inputStyle, height: "80px", resize: "none" }}
          />
        </div>

        {/* Készségek */}
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

        {/* Tapasztalat & Tanulmányok */}
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
                  <div style={entryCard}>
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
                    <DebouncedInput
                      placeholder={t().placeholderTitle}
                      value={entry.title}
                      onUpdate={(val) =>
                        updateEntry(type, entry.id, "title", val)
                      }
                      style={inputStyle}
                    />
                    <DebouncedInput
                      placeholder={t().placeholderSub}
                      value={entry.subtitle}
                      onUpdate={(val) =>
                        updateEntry(type, entry.id, "subtitle", val)
                      }
                      style={{ ...inputStyle, "margin-top": "5px" }}
                    />
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        "margin-top": "5px",
                      }}
                    >
                      <DebouncedInput
                        type="month"
                        value={entry.startDate}
                        onUpdate={(val) =>
                          updateEntry(type, entry.id, "startDate", val)
                        }
                        style={inputStyle}
                      />
                      <Show when={!entry.isCurrent}>
                        <DebouncedInput
                          type="month"
                          value={entry.endDate}
                          onUpdate={(val) =>
                            updateEntry(type, entry.id, "endDate", val)
                          }
                          style={inputStyle}
                        />
                      </Show>
                    </div>
                    <label style={{ "font-size": "11px" }}>
                      <input
                        type="checkbox"
                        checked={entry.isCurrent}
                        onChange={(e) =>
                          updateEntry(
                            type,
                            entry.id,
                            "isCurrent",
                            e.currentTarget.checked,
                          )
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
            "margin-top": "20px",
          }}
        >
          {t().printBtn}
        </button>
        <div
          style={{
            "margin-top": "20px",
            "font-size": "10px",
            color: "#94a3b8",
            "text-align": "center",
          }}
        >
          {t().privacyNote}
        </div>
      </aside>

      {/* ELŐNÉZET PANEL */}
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
                  margin: "5px 0",
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

          <Show when={cv().summary}>
            <section style={{ "margin-top": "30px" }}>
              <h3
                style={{
                  color: cv().accentColor,
                  "border-bottom": `1px solid ${cv().lineColor}`,
                  "padding-bottom": "5px",
                  "text-transform": "uppercase",
                  "font-weight": "bold",
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
          </Show>

          <Show when={cv().expertise.length > 0}>
            <section style={{ "margin-top": "30px" }}>
              <h3
                style={{
                  color: cv().accentColor,
                  "border-bottom": `1px solid ${cv().lineColor}`,
                  "padding-bottom": "5px",
                  "text-transform": "uppercase",
                  "font-weight": "bold",
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

          <For each={["experience", "education"] as const}>
            {(type) => (
              <section style={{ "margin-top": "30px" }}>
                <h3
                  style={{
                    color: cv().accentColor,
                    "border-bottom": `1px solid ${cv().lineColor}`,
                    "padding-bottom": "5px",
                    "text-transform": "uppercase",
                    "font-weight": "bold",
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
                      <div
                        style={{
                          color:
                            type === "experience"
                              ? cv().accentColor
                              : "inherit",
                          "font-weight": "500",
                        }}
                      >
                        {entry.subtitle}
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
