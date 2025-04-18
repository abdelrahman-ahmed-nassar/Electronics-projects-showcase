export const validateField = (name, value, formData, setErrors) => {
  let errorMessage = null;

  switch (name) {
    case "name":
      if (!value.trim()) errorMessage = "الاسم مطلوب";
      break;
    case "phone":
      if (!value.trim()) {
        errorMessage = "رقم الهاتف مطلوب";
      } else if (!/^01[0-9]{9}$/.test(value)) {
        errorMessage =
          "رقم الهاتف غير صالح، يجب أن يبدأ بـ 01 ويتكون من 11 رقم";
      } else if (value === formData.parentPhone) {
        errorMessage = "رقم الهاتف ورقم هاتف ولي الأمر يجب أن يكون مختلفين";
      }
      break;
    case "parentPhone":
      if (!value.trim()) {
        errorMessage = "رقم هاتف ولي الأمر مطلوب";
      } else if (!/^01[0-9]{9}$/.test(value)) {
        errorMessage =
          "رقم الهاتف غير صالح، يجب أن يبدأ بـ 01 ويتكون من 11 رقم";
      } else if (value === formData.phone) {
        errorMessage = "رقم الهاتف ورقم هاتف ولي الأمر يجب أن يكون مختلفين";
      }
      break;
    case "email":
      if (!value.trim()) {
        errorMessage = "البريد الإلكتروني مطلوب";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMessage = "صيغة البريد الإلكتروني غير صحيحة";
      }
      break;
    case "password":
      if (!value) {
        errorMessage = "كلمة السر مطلوبة";
      } else if (value.length < 8) {
        errorMessage = "كلمة السر يجب أن تتكون من 8 أحرف على الأقل";
      }
      break;
    case "passwordCheck":
      if (!value) {
        errorMessage = "تأكيد كلمة السر مطلوب";
      } else if (value !== formData.password) {
        errorMessage = "كلمة السر غير متطابقة";
      }
      break;
    default:
      break;
  }

  setErrors((prev) => ({
    ...prev,
    [name]: errorMessage,
  }));
};

export const validateForm = (formData, setErrors) => {
  let isValid = true;
  const newErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = "الاسم مطلوب";
    isValid = false;
  }

  const phoneRegex = /^01[0-9]{9}$/;
  if (!formData.phone.trim()) {
    newErrors.phone = "رقم الهاتف مطلوب";
    isValid = false;
  } else if (!phoneRegex.test(formData.phone)) {
    newErrors.phone = "رقم الهاتف غير صالح، يجب أن يبدأ بـ 01 ويتكون من 11 رقم";
    isValid = false;
  }

  if (!formData.parentPhone.trim()) {
    newErrors.parentPhone = "رقم هاتف ولي الأمر مطلوب";
    isValid = false;
  } else if (!phoneRegex.test(formData.parentPhone)) {
    newErrors.parentPhone =
      "رقم الهاتف غير صالح، يجب أن يبدأ بـ 01 ويتكون من 11 رقم";
    isValid = false;
  }

  if (formData.parentPhone === formData.phone) {
    newErrors.parentPhone =
      "رقم الهاتف ورقم هاتف ولي الأمر يجب أن يكون مختلفين";
    isValid = false;
  }

  if (formData.gender === null) {
    newErrors.gender = "يرجى اختيار النوع";
    isValid = false;
  }

  if (formData.government === null) {
    newErrors.government = "يرجى اختيار المحافظة";
    isValid = false;
  }

  if (formData.yearId === null) {
    newErrors.yearId = "يرجى اختيار الصف الدراسي";
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    newErrors.email = "البريد الإلكتروني مطلوب";
    isValid = false;
  } else if (!emailRegex.test(formData.email)) {
    newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
    isValid = false;
  }

  if (!formData.password) {
    newErrors.password = "كلمة السر مطلوبة";
    isValid = false;
  } else if (formData.password.length < 8) {
    newErrors.password = "كلمة السر يجب أن تتكون من 8 أحرف على الأقل";
    isValid = false;
  }

  if (!formData.passwordCheck) {
    newErrors.passwordCheck = "تأكيد كلمة السر مطلوب";
    isValid = false;
  } else if (formData.password !== formData.passwordCheck) {
    newErrors.passwordCheck = "كلمة السر غير متطابقة";
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
};

export const handleInputChange = (
  e,
  formData,
  setFormData,
  errors,
  setErrors
) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });

  if (errors[name]) {
    setErrors({
      ...errors,
      [name]: null,
    });
  }
};

export const handleSelectChange = (
  name,
  selectedOption,
  formData,
  setFormData,
  errors,
  setErrors
) => {
  setFormData({
    ...formData,
    [name]: selectedOption ? selectedOption.value : null,
  });

  if (errors[name]) {
    setErrors({
      ...errors,
      [name]: null,
    });
  }
};
