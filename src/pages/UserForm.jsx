import { useState } from "react";

function UserForm({
  setPage,
  addItem,
}) {
  const [type, setType] = useState("Lost");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Essentials",
    location: "",
    date: "Today",
    details: "",
  });

  function update(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleImage(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  }

  async function submit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter the item name.");
      return;
    }

    if (!form.location.trim()) {
      alert("Please enter the location.");
      return;
    }

    if (!form.details.trim()) {
      alert("Please enter a description.");
      return;
    }

    setSaving(true);

    try {
      await addItem({
        ...form,
        title: form.title.trim(),
        location: form.location.trim(),
        details: form.details.trim(),
        type,
        status: type,
        image,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="report-page">

      <section className="report-intro">

        <span className="section-kicker">
          NEW REPORT
        </span>

        <h1>
          Give it a clear
          <br />
          <em>description.</em>
        </h1>

        <p>
          Add the important details so
          another student can recognise
          the item quickly.
        </p>

        <div className="report-tips">

          <div>
            <b>01</b>
            Exact location
          </div>

          <div>
            <b>02</b>
            Clear image
          </div>

          <div>
            <b>03</b>
            Useful description
          </div>

        </div>

      </section>

      <form
        className="report-form"
        onSubmit={submit}
      >

        <div className="form-header">

          <span>01</span>

          <div>
            <h2>
              Item details
            </h2>

            <p>
              Tell us about the item.
            </p>
          </div>

        </div>

        <div className="type-switch">

          <label>
            Report type
          </label>

          <div>

            <button
              type="button"
              className={
                type === "Lost"
                  ? "selected lost"
                  : ""
              }
              onClick={() => setType("Lost")}
              disabled={saving}
            >
              I lost something
            </button>

            <button
              type="button"
              className={
                type === "Found"
                  ? "selected found"
                  : ""
              }
              onClick={() => setType("Found")}
              disabled={saving}
            >
              I found something
            </button>

          </div>

        </div>

        <label className="form-field">

          <span>
            Item name
          </span>

          <input
            name="title"
            value={form.title}
            onChange={update}
            placeholder="e.g. Black wallet"
            required
            disabled={saving}
          />

        </label>

        <div className="two-fields">

          <label className="form-field">

            <span>
              Category
            </span>

            <select
              name="category"
              value={form.category}
              onChange={update}
              disabled={saving}
            >
              <option>Essentials</option>
              <option>Electronics</option>
              <option>Personal</option>
              <option>ID & Cards</option>
              <option>Clothing</option>
              <option>Study</option>
              <option>Other</option>
            </select>

          </label>

          <label className="form-field">

            <span>
              Date
            </span>

            <input
              name="date"
              value={form.date}
              onChange={update}
              placeholder="Today"
              disabled={saving}
            />

          </label>

        </div>

        <label className="form-field">

          <span>
            Location
          </span>

          <input
            name="location"
            value={form.location}
            onChange={update}
            placeholder="e.g. Central Library, 2nd floor"
            required
            disabled={saving}
          />

        </label>

        <label className="form-field">

          <span>
            Item image
          </span>

          <div className="upload-area">

            {image ? (

              <div className="upload-preview">

                <img
                  src={image}
                  alt="Preview"
                />

                <button
                  type="button"
                  onClick={() => setImage("")}
                  disabled={saving}
                >
                  Remove
                </button>

              </div>

            ) : (

              <label className="upload-label">

                <strong>
                  + Upload image
                </strong>

                <small>
                  JPG, PNG or WEBP · Max 5MB
                </small>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  disabled={saving}
                />

              </label>

            )}

          </div>

        </label>

        <label className="form-field">

          <span>
            Description
          </span>

          <textarea
            name="details"
            value={form.details}
            onChange={update}
            rows="5"
            placeholder="Colour, brand, unique marks or anything useful..."
            required
            disabled={saving}
          />

        </label>

        <button
          className="primary-btn full"
          type="submit"
          disabled={saving}
        >
          {saving ? "Publishing..." : "Publish report"}
          <span>{saving ? "..." : "↗"}</span>
        </button>

        <button
          className="cancel-button"
          type="button"
          onClick={() => setPage("home")}
          disabled={saving}
        >
          Cancel
        </button>

      </form>

    </main>
  );
}

export default UserForm;