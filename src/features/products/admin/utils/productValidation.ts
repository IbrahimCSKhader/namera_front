import {
  type ProductCustomizationFieldDraft,
  type ProductDraft,
  type ProductFieldErrors,
  type ProductOptionGroupDraft,
  type ProductValidationResult,
} from '../types/productAdminTypes';

const productNameMaxLength = 120;

export function validateProductDraft(draft: ProductDraft): ProductValidationResult {
  const errors: ProductFieldErrors = {};

  validateName(draft, errors);
  validateCategory(draft, errors);
  validateImages(draft, errors);
  validatePricing(draft, errors);
  validateInventory(draft, errors);
  validatePreparation(draft, errors);
  validateVisibility(draft, errors);
  validateOptionGroups(draft.optionGroups, errors);
  validateCustomizationFields(draft.customizationFields, errors);

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function validateName(draft: ProductDraft, errors: ProductFieldErrors) {
  const name = draft.name.trim();

  if (!name) {
    addError(errors, 'name', 'اسم المنتج مطلوب');
    return;
  }

  if (name.length < 3) {
    addError(errors, 'name', 'اسم المنتج يجب أن يحتوي على 3 أحرف على الأقل');
  }

  if (name.length > productNameMaxLength) {
    addError(errors, 'name', `اسم المنتج يجب ألا يتجاوز ${productNameMaxLength} حرفًا`);
  }
}

function validateCategory(draft: ProductDraft, errors: ProductFieldErrors) {
  if (!draft.categoryId.trim()) {
    addError(errors, 'categoryId', 'يجب اختيار تصنيف للمنتج');
  }
}

function validateImages(draft: ProductDraft, errors: ProductFieldErrors) {
  const primaryImages = draft.images.filter((image) => image.isPrimary && image.imageUrl.trim());

  if (primaryImages.length === 0) {
    addError(errors, 'images.primary', 'يجب تحديد صورة رئيسية واحدة على الأقل');
  }

  if (primaryImages.length > 1) {
    addError(errors, 'images.primary', 'لا يمكن تعيين أكثر من صورة رئيسية واحدة');
  }

  draft.images.forEach((image, index) => {
    if (!image.imageUrl.trim()) {
      addError(errors, `images.${index}.imageUrl`, 'رابط الصورة مطلوب');
    }
  });
}

function validatePricing(draft: ProductDraft, errors: ProductFieldErrors) {
  if (draft.pricingType !== 'quote' && draft.basePrice == null) {
    addError(errors, 'basePrice', 'يجب إدخال سعر موجب');
  }

  if (draft.basePrice != null && draft.basePrice < 0) {
    addError(errors, 'basePrice', 'السعر يجب أن يكون رقمًا موجبًا');
  }

  if (draft.pricingType === 'quote' && !draft.priceLabel.trim()) {
    addError(errors, 'priceLabel', 'اكتب عبارة السعر الظاهرة للعميل');
  }
}

function validateInventory(draft: ProductDraft, errors: ProductFieldErrors) {
  if (draft.minOrderQuantity < 1) {
    addError(errors, 'minOrderQuantity', 'أقل كمية يجب أن تكون 1 على الأقل');
  }

  if (draft.maxOrderQuantity != null && draft.maxOrderQuantity < draft.minOrderQuantity) {
    addError(errors, 'maxOrderQuantity', 'أقصى كمية يجب أن تكون أكبر من أو تساوي أقل كمية');
  }

  if (draft.inventoryTrackingEnabled && !draft.madeToOrder) {
    if (draft.quantity == null) {
      addError(errors, 'quantity', 'الكمية مطلوبة عند تفعيل تتبع المخزون');
    }

    if ((draft.quantity ?? 0) < 0) {
      addError(errors, 'quantity', 'الكمية لا يمكن أن تكون سالبة');
    }

    if (draft.lowStockThreshold < 0) {
      addError(errors, 'lowStockThreshold', 'حد التنبيه يجب أن يكون رقمًا موجبًا');
    }
  }
}

function validatePreparation(draft: ProductDraft, errors: ProductFieldErrors) {
  if (draft.minPreparationDays != null && draft.minPreparationDays < 0) {
    addError(errors, 'minPreparationDays', 'أقل مدة تجهيز لا يمكن أن تكون سالبة');
  }

  if (draft.maxPreparationDays != null && draft.maxPreparationDays < 0) {
    addError(errors, 'maxPreparationDays', 'أقصى مدة تجهيز لا يمكن أن تكون سالبة');
  }

  if (
    draft.minPreparationDays != null &&
    draft.maxPreparationDays != null &&
    draft.maxPreparationDays < draft.minPreparationDays
  ) {
    addError(errors, 'maxPreparationDays', 'أقصى مدة تجهيز يجب أن تكون أكبر من أو تساوي أقل مدة');
  }
}

function validateVisibility(draft: ProductDraft, errors: ProductFieldErrors) {
  if (draft.visibleFrom && draft.visibleTo && draft.visibleTo < draft.visibleFrom) {
    addError(errors, 'visibleTo', 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية');
  }
}

function validateOptionGroups(optionGroups: ProductOptionGroupDraft[], errors: ProductFieldErrors) {
  optionGroups.forEach((group, groupIndex) => {
    if (!group.name.trim()) {
      addError(errors, `optionGroups.${groupIndex}.name`, 'اسم مجموعة الخيارات مطلوب');
    }

    const activeValues = group.values.filter((value) => value.isActive);
    if (group.isRequired && activeValues.length === 0) {
      addError(errors, `optionGroups.${groupIndex}.values`, 'المجموعة الإجبارية تحتاج إلى قيمة متاحة واحدة على الأقل');
    }

    const labels = new Set<string>();
    group.values.forEach((value, valueIndex) => {
      if (!value.label.trim()) {
        addError(errors, `optionGroups.${groupIndex}.values.${valueIndex}.label`, 'اسم القيمة مطلوب');
      }

      if (value.extraPrice < 0) {
        addError(errors, `optionGroups.${groupIndex}.values.${valueIndex}.extraPrice`, 'التكلفة الإضافية لا يمكن أن تكون سالبة');
      }

      const normalizedLabel = value.label.trim().toLowerCase();
      if (normalizedLabel && labels.has(normalizedLabel)) {
        addError(errors, `optionGroups.${groupIndex}.values`, 'قيم الخيار داخل المجموعة نفسها يجب ألا تتكرر');
      }

      labels.add(normalizedLabel);
    });
  });
}

function validateCustomizationFields(fields: ProductCustomizationFieldDraft[], errors: ProductFieldErrors) {
  fields.forEach((field, fieldIndex) => {
    if (!field.label.trim()) {
      addError(errors, `customizationFields.${fieldIndex}.label`, 'اسم حقل التخصيص مطلوب');
    }

    if (field.minLength != null && field.minLength < 0) {
      addError(errors, `customizationFields.${fieldIndex}.minLength`, 'الحد الأدنى للطول لا يمكن أن يكون سالبًا');
    }

    if (field.maxLength != null && field.maxLength < 0) {
      addError(errors, `customizationFields.${fieldIndex}.maxLength`, 'الحد الأعلى للطول لا يمكن أن يكون سالبًا');
    }

    if (field.minLength != null && field.maxLength != null && field.maxLength < field.minLength) {
      addError(errors, `customizationFields.${fieldIndex}.maxLength`, 'الحد الأعلى للطول يجب أن يكون أكبر من أو يساوي الحد الأدنى');
    }

    if (field.minValue != null && field.maxValue != null && field.maxValue < field.minValue) {
      addError(errors, `customizationFields.${fieldIndex}.maxValue`, 'الحد الأعلى للقيمة يجب أن يكون أكبر من أو يساوي الحد الأدنى');
    }

    if ((field.type === 'singleSelect' || field.type === 'multiSelect') && field.choiceLabels.length === 0) {
      addError(errors, `customizationFields.${fieldIndex}.choiceLabels`, 'هذا الحقل يحتاج إلى خيارات متاحة');
    }

    if (field.type === 'imageUpload' && field.allowedFiles.length === 0) {
      addError(errors, `customizationFields.${fieldIndex}.allowedFiles`, 'حدد أنواع الملفات المسموحة لرفع الصور');
    }
  });
}

function addError(errors: ProductFieldErrors, field: string, message: string) {
  errors[field] ??= [];
  errors[field].push(message);
}
