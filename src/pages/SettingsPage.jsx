import React, { useEffect, useState } from "react";
import API from "../api/api";

function SettingsPage() {

  const [settings, setSettings] = useState({
  companyName: "",
  companyEmail: "",
  companyPhone: "",
  whatsappNumber: "",
  smtpEmail: "",
  smtpPassword: "",

  whatsappAuto: true,
  emailAuto: false,

  autoFollowupEnabled: true,

  hotLeadWhatsappTemplate:
    "Hi {{name}}, thank you for your interest. Our team will contact you shortly.",

  warmLeadWhatsappTemplate:
    "Hi {{name}}, thank you for connecting with us.",

  coldLeadEmailSubject:
    "Thank You For Your Interest",

  coldLeadEmailTemplate:
    "Hi {{name}}, Thank you for contacting us."
});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {

    try {

      const res =
        await API.get("/settings");

      if (res.data.success) {

        setSettings({
          companyName:
            res.data.settings.companyName || "",

          companyEmail:
            res.data.settings.companyEmail || "",

          companyPhone:
            res.data.settings.companyPhone || "",

          whatsappNumber:
            res.data.settings.whatsappNumber || "",

          smtpEmail:
            res.data.settings.smtpEmail || "",

          smtpPassword:
            res.data.settings.smtpPassword || "",

          whatsappAuto:
            res.data.settings.whatsappAuto ?? true,


          emailAuto:
            res.data.settings.emailAuto ?? false,
            autoFollowupEnabled:
res.data.settings.autoFollowupEnabled ?? true,

hotLeadWhatsappTemplate:
res.data.settings.hotLeadWhatsappTemplate || "",

warmLeadWhatsappTemplate:
res.data.settings.warmLeadWhatsappTemplate || "",

coldLeadEmailSubject:
res.data.settings.coldLeadEmailSubject || "",

coldLeadEmailTemplate:
res.data.settings.coldLeadEmailTemplate || ""
        });

      }

    } catch (err) {

      console.log(err);

    }

  };

  const saveSettings = async () => {

    try {

      const res =
        await API.put(
          "/settings",
          settings
        );

      if (res.data.success) {

        alert(
          "Settings Saved Successfully ✅"
        );

      }

    } catch (err) {

      console.log(err);

      alert(
        "Failed To Save Settings ❌"
      );

    }

  };

  return (

    <div
      style={{
        padding: "30px",
        maxWidth: "700px"
      }}
    >

      <h1
        style={{
          fontSize: "30px",
          fontWeight: "bold",
          marginBottom: "20px"
        }}
      >
        ⚙️ Company Settings
      </h1>

      {/* COMPANY NAME */}

      <input
        type="text"
        placeholder="Company Name"
        value={settings.companyName}
        onChange={(e) =>
          setSettings({
            ...settings,
            companyName: e.target.value
          })
        }
        style={styles.input}
      />

      {/* COMPANY EMAIL */}

      <input
        type="email"
        placeholder="Company Email"
        value={settings.companyEmail}
        onChange={(e) =>
          setSettings({
            ...settings,
            companyEmail: e.target.value
          })
        }
        style={styles.input}
      />

      {/* COMPANY PHONE */}

      <input
        type="text"
        placeholder="Company Phone"
        value={settings.companyPhone}
        onChange={(e) =>
          setSettings({
            ...settings,
            companyPhone: e.target.value
          })
        }
        style={styles.input}
      />

      {/* WHATSAPP NUMBER */}

      <input
        type="text"
        placeholder="WhatsApp Number"
        value={settings.whatsappNumber}
        onChange={(e) =>
          setSettings({
            ...settings,
            whatsappNumber: e.target.value
          })
        }
        style={styles.input}
      />

      {/* SMTP EMAIL */}

      <input
        type="email"
        placeholder="SMTP Email"
        value={settings.smtpEmail}
        onChange={(e) =>
          setSettings({
            ...settings,
            smtpEmail: e.target.value
          })
        }
        style={styles.input}
      />

      {/* SMTP PASSWORD */}

      <input
        type="password"
        placeholder="SMTP Password"
        value={settings.smtpPassword}
        onChange={(e) =>
          setSettings({
            ...settings,
            smtpPassword: e.target.value
          })
        }
        style={styles.input}
      />

      {/* WHATSAPP AUTO */}

      <div style={styles.checkboxRow}>

        <label>

          <input
            type="checkbox"
            checked={settings.whatsappAuto}
            onChange={(e) =>
              setSettings({
                ...settings,
                whatsappAuto:
                  e.target.checked
              })
            }
          />

          {" "}Auto WhatsApp

        </label>

      </div>

      {/* EMAIL AUTO */}

      <div style={styles.checkboxRow}>

        <label>

          <input
            type="checkbox"
            checked={settings.emailAuto}
            onChange={(e) =>
              setSettings({
                ...settings,
                emailAuto:
                  e.target.checked
              })
            }
          />

          {" "}Auto Email

        </label>

      </div>

      
<div style={styles.checkboxRow}>
<label>

<input
type="checkbox"
checked={settings.autoFollowupEnabled}
onChange={(e)=>
setSettings({
...settings,
autoFollowupEnabled:e.target.checked
})
}
/>

{" "}Auto Followup

</label>
</div>

<textarea
placeholder="Hot Lead WhatsApp Template"
value={settings.hotLeadWhatsappTemplate}
onChange={(e)=>
setSettings({
...settings,
hotLeadWhatsappTemplate:e.target.value
})
}
style={{
...styles.input,
height:"120px"
}}
/>

<textarea
placeholder="Warm Lead WhatsApp Template"
value={settings.warmLeadWhatsappTemplate}
onChange={(e)=>
setSettings({
...settings,
warmLeadWhatsappTemplate:e.target.value
})
}
style={{
...styles.input,
height:"120px"
}}
/>

<input
type="text"
placeholder="Cold Lead Email Subject"
value={settings.coldLeadEmailSubject}
onChange={(e)=>
setSettings({
...settings,
coldLeadEmailSubject:e.target.value
})
}
style={styles.input}
/>

<textarea
placeholder="Cold Lead Email Template"
value={settings.coldLeadEmailTemplate}
onChange={(e)=>
setSettings({
...settings,
coldLeadEmailTemplate:e.target.value
})
}
style={{
...styles.input,
height:"120px"
}}
/>
<button
        onClick={saveSettings}
        style={styles.button}
      >
        Save Settings
      </button>
    </div>

  );
}
const styles = {

  input: {

    width: "100%",

    padding: "12px",

    marginBottom: "15px",

    border: "1px solid #ccc",

    borderRadius: "10px"

  },

  checkboxRow: {

    marginBottom: "15px",

    fontSize: "16px"

  },

  button: {

    background: "#2563eb",

    color: "#fff",

    border: "none",

    padding: "12px 20px",

    borderRadius: "10px",

    cursor: "pointer",

    fontWeight: "bold"

  }

};

export default SettingsPage;