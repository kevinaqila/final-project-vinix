import { useState } from "react";
import { X } from "lucide-react";

const InputModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  placeholder,
  label,
  submitText = "Submit",
  cancelText = "Cancel",
}) => {
  const [value, setValue] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value);
    setValue("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay - Semi transparent */}
      <div className="fixed inset-0 bg-gray-900/30 " onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>

        {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
        />

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputModal;
