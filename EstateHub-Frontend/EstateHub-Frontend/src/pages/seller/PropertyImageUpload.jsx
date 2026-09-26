
import { useEffect, useState } from "react";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  Images,
  ShieldCheck,
} from "lucide-react";

import {
  uploadPropertyImage,
  getPropertyImages,
  deletePropertyImage,
} from "../../api/propertyImageApi";

const FRASER = {
  fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
};

export default function PropertyImageUpload({ propertyId }) {
  const MIN_IMAGES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================
     LOAD EXISTING IMAGES
  ========================= */

  const loadImages = async () => {
    if (!propertyId) return;

    try {
      setLoadingImages(true);
      setError("");

      const data = await getPropertyImages(propertyId);

      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load images."
      );
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [propertyId]);

  const currentImageCount =
    images.length + selectedFiles.length;

  const minimumReached =
    images.length >= MIN_IMAGES ||
    currentImageCount >= MIN_IMAGES;

  /* =========================
     FILE SELECTION
  ========================= */

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    setError("");
    setSuccess("");

    if (files.length === 0) return;

    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(
          `"${file.name}" exceeds the 5 MB limit.`
        );
        continue;
      }

      validFiles.push(file);

      newPreviews.push({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        url: URL.createObjectURL(file),
        name: file.name,
      });
    }

    if (validFiles.length === 0) {
      setError("Please select valid image files.");
      e.target.value = "";
      return;
    }

    setSelectedFiles((prev) => [
      ...prev,
      ...validFiles,
    ]);

    setPreviews((prev) => [
      ...prev,
      ...newPreviews,
    ]);

    e.target.value = "";
  };

  /* =========================
     REMOVE SELECTED FILE
  ========================= */

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setPreviews((prev) => {
      if (prev[index]?.url) {
        URL.revokeObjectURL(prev[index].url);
      }

      return prev.filter((_, i) => i !== index);
    });

    setError("");
    setSuccess("");
  };

  /* =========================
     CLEAR SELECTED FILES
  ========================= */

  const clearSelectedFiles = () => {
    previews.forEach((preview) => {
      if (preview.url) {
        URL.revokeObjectURL(preview.url);
      }
    });

    setSelectedFiles([]);
    setPreviews([]);
    setError("");
    setSuccess("");
  };

  /* =========================
     UPLOAD
  ========================= */

  const handleUpload = async () => {
    if (!propertyId) {
      return setError("Property ID is required.");
    }

    if (selectedFiles.length === 0) {
      return setError(
        "Please select at least one image."
      );
    }

    const totalAfterUpload =
      images.length + selectedFiles.length;

    if (totalAfterUpload < MIN_IMAGES) {
      const remaining =
        MIN_IMAGES - totalAfterUpload;

      return setError(
        `Please upload at least ${remaining} more image${
          remaining > 1 ? "s" : ""
        }. Minimum ${MIN_IMAGES} images required.`
      );
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const uploadedImages = [];

      for (const file of selectedFiles) {
        const uploaded = await uploadPropertyImage(
          propertyId,
          file
        );

        uploadedImages.push(uploaded);
      }

      setImages((prev) => [
        ...prev,
        ...uploadedImages,
      ]);

      previews.forEach((preview) => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });

      setSelectedFiles([]);
      setPreviews([]);

      const finalCount =
        images.length + uploadedImages.length;

      setSuccess(
        `${uploadedImages.length} image${
          uploadedImages.length > 1 ? "s" : ""
        } uploaded. ${
          finalCount >= MIN_IMAGES
            ? `Minimum ${MIN_IMAGES} images satisfied.`
            : ""
        }`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to upload image."
      );
    } finally {
      setUploading(false);
    }
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (imageId) => {
    if (!propertyId) return;

    if (images.length <= MIN_IMAGES) {
      return setError(
        `You must keep at least ${MIN_IMAGES} images.`
      );
    }

    try {
      setDeletingId(imageId);
      setError("");
      setSuccess("");

      await deletePropertyImage(
        propertyId,
        imageId
      );

      setImages((prev) =>
        prev.filter((img) => img.id !== imageId)
      );

      setSuccess("Image deleted.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete image."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================
     CLEANUP
  ========================= */

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [previews]);

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#D8CFB9] bg-[#FBF8F1]">
      {/* HEADER */}

      <div className="border-b border-[#E4DCC9] bg-[#F7F4EC] px-5 py-6 sm:px-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#201C15] text-[#D8B876]">
              <Images size={21} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#AD8332]">
                  Property media
                </p>

                <span className="rounded-full border border-[#D8CFB9] bg-[#FBF8F1] px-2.5 py-1 text-[10px] font-bold text-[#6B6252]">
                  {images.length}/{MIN_IMAGES} minimum
                </span>
              </div>

              <h2
                style={FRASER}
                className="mt-1 text-2xl text-[#201C15] sm:text-3xl"
              >
                Property images
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#756D5E]">
                Add clear, high-quality photographs to help buyers
                understand the property.
              </p>
            </div>
          </div>

          <div
            className={`flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${
              images.length >= MIN_IMAGES
                ? "border-[#B8CCBC] bg-[#EEF5EF] text-[#3F6B52]"
                : "border-[#E2CAA1] bg-[#F8EFD9] text-[#8C6924]"
            }`}
          >
            {images.length >= MIN_IMAGES ? (
              <CheckCircle size={15} />
            ) : (
              <AlertCircle size={15} />
            )}

            {images.length >= MIN_IMAGES
              ? "Minimum satisfied"
              : `${MIN_IMAGES - images.length} more needed`}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#8A806D]">
          <span>PNG</span>
          <span>JPG</span>
          <span>WEBP</span>
          <span>Maximum 5 MB each</span>
          <span>Minimum {MIN_IMAGES} images</span>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* ALERTS */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#E4BBB5] bg-[#FBEEEB] px-4 py-4 text-sm text-[#9E473D]">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span className="flex-1">{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-bold hover:text-[#7E352D]"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#B8CCBC] bg-[#EEF5EF] px-4 py-4 text-sm text-[#3F6B52]">
            <CheckCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>{success}</span>
          </div>
        )}

        {/* UPLOAD AREA */}

        <label
          className={`group flex cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed px-5 py-10 text-center transition ${
            uploading
              ? "cursor-not-allowed border-[#D8CFB9] bg-[#F1EDE3]"
              : "border-[#D8CFB9] bg-[#F7F4EC] hover:border-[#AD8332] hover:bg-[#F4EDDE]"
          }`}
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#201C15] text-[#D8B876] transition group-hover:scale-105">
            <Upload size={23} />
          </div>

          <span
            style={FRASER}
            className="text-xl text-[#201C15]"
          >
            Choose property images
          </span>

          <span className="mt-2 text-xs text-[#8A806D]">
            Click to browse · Multiple selection allowed
          </span>

          <span className="mt-1 text-[11px] text-[#A29A8A]">
            PNG, JPG or WEBP · Maximum 5 MB per image
          </span>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {/* SELECTED PREVIEWS */}

        {previews.length > 0 && (
          <div className="mt-7">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD8332]">
                  Upload queue
                </p>

                <h3
                  style={FRASER}
                  className="mt-1 text-xl text-[#201C15]"
                >
                  Selected images
                </h3>
              </div>

              <button
                type="button"
                onClick={clearSelectedFiles}
                disabled={uploading}
                className="w-fit text-xs font-bold text-[#B3564B] transition hover:text-[#7E352D] disabled:opacity-50"
              >
                Clear all
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between rounded-2xl border border-[#E4DCC9] bg-[#F7F4EC] px-4 py-3">
              <span className="text-xs font-semibold text-[#6B6252]">
                Total after upload
              </span>

              <span
                className={`text-sm font-bold ${
                  currentImageCount >= MIN_IMAGES
                    ? "text-[#3F6B52]"
                    : "text-[#B3564B]"
                }`}
              >
                {currentImageCount} / {MIN_IMAGES} minimum
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {previews.map((preview, index) => (
                <div
                  key={preview.id}
                  className="group relative overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#F7F4EC]"
                >
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="h-36 w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <button
                    type="button"
                    onClick={() =>
                      removeSelectedFile(index)
                    }
                    disabled={uploading}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#201C15]/80 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 disabled:opacity-40"
                  >
                    <X size={15} />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2">
                    <p className="truncate text-[10px] font-medium text-white">
                      {preview.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={handleUpload}
                disabled={
                  uploading || !minimumReached
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#201C15] px-5 py-3.5 text-sm font-bold text-[#FBF8F1] transition hover:bg-[#2C2820] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {uploading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={17} />
                    Upload images
                  </>
                )}
              </button>

              {!minimumReached && (
                <p className="mt-2 text-xs text-[#B3564B]">
                  Select{" "}
                  {Math.max(
                    0,
                    MIN_IMAGES - images.length
                  )}{" "}
                  more image
                  {Math.max(
                    0,
                    MIN_IMAGES - images.length
                  ) !== 1
                    ? "s"
                    : ""}{" "}
                  to meet the minimum requirement.
                </p>
              )}
            </div>
          </div>
        )}

        {/* EXISTING IMAGES */}

        <div className="mt-9 border-t border-[#E4DCC9] pt-7">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD8332]">
                Current gallery
              </p>

              <h3
                style={FRASER}
                className="mt-1 text-2xl text-[#201C15]"
              >
                Uploaded images
              </h3>
            </div>

            <span className="text-sm font-semibold text-[#756D5E]">
              {images.length} image
              {images.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loadingImages ? (
            <div className="flex min-h-40 items-center justify-center rounded-2xl border border-[#E4DCC9] bg-[#F7F4EC]">
              <div className="text-center">
                <Loader2
                  size={26}
                  className="mx-auto animate-spin text-[#8C6924]"
                />

                <p className="mt-2 text-xs text-[#8A806D]">
                  Loading your gallery...
                </p>
              </div>
            </div>
          ) : images.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D8CFB9] bg-[#F7F4EC] px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECE5D6] text-[#9B927F]">
                <ImageIcon size={25} />
              </div>

              <h4
                style={FRASER}
                className="mt-4 text-xl text-[#201C15]"
              >
                No images yet
              </h4>

              <p className="mx-auto mt-1 max-w-sm text-sm text-[#8A806D]">
                Upload at least {MIN_IMAGES} images to complete
                your property gallery.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className="group relative overflow-hidden rounded-2xl border border-[#D8CFB9] bg-[#F7F4EC]"
                  >
                    <img
                      src={img.imageUrl}
                      alt={`Property image ${index + 1}`}
                      className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                    {index === 0 && (
                      <div className="absolute left-2 top-2 rounded-full border border-white/20 bg-[#201C15]/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm">
                        Cover
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(img.id)
                      }
                      disabled={
                        deletingId === img.id ||
                        images.length <= MIN_IMAGES
                      }
                      title={
                        images.length <= MIN_IMAGES
                          ? `Keep at least ${MIN_IMAGES} images`
                          : "Delete image"
                      }
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#B3564B] text-white opacity-0 shadow-lg transition group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {deletingId === img.id ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2">
                      <span className="text-[10px] font-semibold text-white/90">
                        Image {index + 1}
                      </span>

                      {images.length <= MIN_IMAGES && (
                        <ShieldCheck
                          size={14}
                          className="text-[#D8B876]"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* REQUIREMENT */}

              <div
                className={`mt-5 flex items-start gap-3 rounded-2xl border px-4 py-4 ${
                  images.length >= MIN_IMAGES
                    ? "border-[#B8CCBC] bg-[#EEF5EF]"
                    : "border-[#E2CAA1] bg-[#F8EFD9]"
                }`}
              >
                {images.length >= MIN_IMAGES ? (
                  <CheckCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-[#3F6B52]"
                  />
                ) : (
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-[#8C6924]"
                  />
                )}

                <div>
                  <p
                    className={`text-sm font-bold ${
                      images.length >= MIN_IMAGES
                        ? "text-[#3F6B52]"
                        : "text-[#8C6924]"
                    }`}
                  >
                    {images.length >= MIN_IMAGES
                      ? `${MIN_IMAGES} image minimum satisfied.`
                      : `Upload ${
                          MIN_IMAGES - images.length
                        } more image${
                          MIN_IMAGES - images.length !==
                          1
                            ? "s"
                            : ""
                        }.`}
                  </p>

                  <p
                    className={`mt-1 text-xs ${
                      images.length >= MIN_IMAGES
                        ? "text-[#547460]"
                        : "text-[#9A7937]"
                    }`}
                  >
                    {images.length >= MIN_IMAGES
                      ? "Your property has enough images for the current requirement."
                      : "Keep adding images before completing the property listing."}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

