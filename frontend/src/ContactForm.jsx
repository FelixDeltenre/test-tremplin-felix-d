import React, { useState } from "react";

export default function ContactForm() {
  const [disponibilites, setDisponibilites] = useState([]);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    genre: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    message: "",
    objet: "",
    jour: "Lundi",
    heure: "9",
    minute: "0",
  });

  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const heures = Array.from({ length: 24 }, (_, i) => i.toString());
  const minutes = ["0", "15", "30", "45"];

  const ajouterDisponibilite = () => {
    const { jour, heure, minute } = form;
    if (!jour || !heure || !minute) return;
    const label = `${jour} à ${heure}h${minute.padStart(2, "0")}`;
    setDisponibilites([...disponibilites, { jour, heure, minute, label }]);
  };

  const supprimerDisponibilite = (index) => {
    setDisponibilites(disponibilites.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const envoyerFormulaire = async () => {
    setErrors({});

    const newErrors = {};
    if (!form.genre) newErrors.genre = "Le genre est requis";
    if (!form.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!form.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!form.email.trim()) newErrors.email = "L'email est requis";
    if (!form.telephone.trim()) newErrors.telephone = "Le téléphone est requis";
    if (!form.message.trim()) newErrors.message = "Le message est requis";
    if (!form.objet) newErrors.objet = "L'objet est requis";
    if (disponibilites.length === 0) newErrors.disponibilites = "Ajoutez au moins une disponibilité";

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        alert("Veuillez remplir tous les champs et ajouter au moins une disponibilité.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3001/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, disponibilites }),
        });
        const result = await response.json();
        alert(result.message || "Formulaire soumis !");
    } catch (error) {
        alert("Erreur lors de l'envoi du formulaire.");
    }
  };

  const selectWrapper = "relative";
  const selectClass =
    "rounded-full p-2 pl-3 pr-8 bg-white text-gray-400 appearance-none";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div
        className="rounded-3xl shadow-xl p-8 w-full max-w-5xl bg-cover bg-center bg-no-repeat text-white"
        style={{ backgroundImage: "url('salon.png')" }}
      >
        <h1 className="text-3xl font-bold mb-6">CONTACTEZ L’AGENCE</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* VOS COORDONNÉES */}
          <div>
            <h2 className="font-semibold mb-2">VOS COORDONNÉES</h2>
            <div className="flex items-center gap-4 mb-4">
              <label><input type="radio" name="genre" value="femme" onChange={handleChange} /> Mme</label>
              <label><input type="radio" name="genre" value="homme" onChange={handleChange} /> M</label>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" name="nom" placeholder="Nom" onChange={handleChange} className="rounded-full p-2 px-4 text-black w-full" />
              <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} className="rounded-full p-2 px-4 text-black w-full" />
            </div>
            <input type="email" name="email" placeholder="Adresse mail" onChange={handleChange} className="rounded-full p-2 px-4 text-black w-full mb-4" />
            <input type="text" name="telephone" placeholder="Téléphone" onChange={handleChange} className="rounded-full p-2 px-4 text-black w-full mb-4" />
          </div>

          {/* VOTRE MESSAGE */}
          <div>
            <h2 className="font-semibold mb-2">VOTRE MESSAGE</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              {["demande de visite", "etre rappele", "plus de photos"].map((o) => (
                <label key={o} className="flex items-center gap-1">
                  <input type="radio" name="objet" value={o} onChange={handleChange} />
                  {o.charAt(0).toUpperCase() + o.slice(1)}
                </label>
              ))}
            </div>
            <textarea name="message" placeholder="Votre message" onChange={handleChange} className="w-full h-32 rounded-xl p-4 text-black" />
          </div>
        </div>

        {/* DISPONIBILITÉS */}
        <div className="mt-6">
          <h2 className="font-semibold mb-2">DISPONIBILITÉS POUR UNE VISITE</h2>
          <div className="flex gap-4 items-center mb-4">
            {[["jour", jours], ["heure", heures], ["minute", minutes]].map(
              ([name, values]) => (
                <div key={name} className={selectWrapper}>
                  <select
                    name={name}
                    onChange={handleChange}
                    className={selectClass}
                    value={form[name]}
                  >
                    {values.map((val) => (
                      <option key={val} value={val}>
                        {name === "heure" ? `${val}h` : name === "minute" ? `${val}m` : val}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm font-bold">
                    ▼
                  </div>
                </div>
              )
            )}
            <button
              onClick={ajouterDisponibilite}
              className="bg-purple-700 text-white rounded-full px-4 py-2 text-sm font-semibold"
            >
              AJOUTER DISPO
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {disponibilites.map((d, i) => (
              <span
                key={i}
                className="bg-gray-200 text-gray-500 text-sm font-normal px-3 py-1 rounded-full flex items-center gap-2"
              >
                {d.label}
                <button
                  onClick={() => supprimerDisponibilite(i)}
                  className="text-gray-500 font-bold text-xl leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* ENVOYER */}
        <div className="flex justify-end mt-6">
          <button
            onClick={envoyerFormulaire}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-full"
          >
            ENVOYER
          </button>
        </div>
      </div>
    </div>
  );
}
