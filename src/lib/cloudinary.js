export const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  console.log("Cloudinary name:", cloudName);
  console.log("Preset:", uploadPreset);

  //This builds the Cloudinary upload endpoint URL.
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  //Creates a FormData object to send in the HTTP request body.
  const formData = new FormData();
  formData.append("file", file); //attaches the actual binary file (your image).
  formData.append("upload_preset", uploadPreset); //attaches your preset so Cloudinary knows how to handle the upload

  //Sends the upload request to Cloudinary.
  const res = await fetch(url, {
    method: "POST", //we’re sending data.
    body: formData, //the image + preset are sent in the request body.
  });

  if (!res.ok) {
    throw new Error("Failed to upload the image");
  }

  const data = await res.json();
  console.log(data);
  return data.secure_url;
};
