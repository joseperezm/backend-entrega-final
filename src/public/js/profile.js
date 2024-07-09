document
  .getElementById("upload-documents-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const uid = "{{user.id}}";
    try {
      const response = await fetch(`/api/users/${uid}/documents`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        alert("Documentos subidos exitosamente.");
        window.location.reload();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error al subir documentos:", error);
      alert("Error interno del servidor");
    }
  });

document
  .getElementById("upload-profile-image-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const uid = "{{user.id}}";
    try {
      const response = await fetch(`/api/users/${uid}/profile-image`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        alert("Imagen subida exitosamente.");
        window.location.reload();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert("Error interno del servidor");
    }
  });
