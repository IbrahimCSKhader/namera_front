import { resolveMediaUrl } from '../../../shared/utils/mediaUrl';
import { type Order, type OrderItem } from '../types/orderTypes';

export type OrderCustomizationDetail = {
  label: string;
  text: string;
  imageUrls: string[];
};

type RawCustomizationDetail = {
  label?: unknown;
  value?: unknown;
};

export function getOrderItemCustomizationDetails(
  item: Pick<OrderItem, 'customizationDetailsJson' | 'customizationSummary'>,
): OrderCustomizationDetail[] {
  const details = parseCustomizationDetailsJson(item.customizationDetailsJson);

  if (details.length > 0) {
    return details;
  }

  return parseCustomizationSummary(item.customizationSummary);
}

export function getOrderItemCustomizationImageUrls(item: Pick<OrderItem, 'customizationDetailsJson' | 'customizationSummary'>): string[] {
  return dedupe(getOrderItemCustomizationDetails(item).flatMap((detail) => detail.imageUrls));
}

export function getOrderCustomizationImageUrls(order: Order): string[] {
  return dedupe(order.items.flatMap(getOrderItemCustomizationImageUrls));
}

export function getOrderItemCustomizationTextLines(item: Pick<OrderItem, 'customizationDetailsJson' | 'customizationSummary'>): string[] {
  return getOrderItemCustomizationDetails(item)
    .map((detail) => {
      if (!detail.text) {
        return '';
      }

      return detail.label ? `${detail.label}: ${detail.text}` : detail.text;
    })
    .filter(Boolean);
}

function parseCustomizationDetailsJson(detailsJson: string): OrderCustomizationDetail[] {
  if (!detailsJson) {
    return [];
  }

  try {
    const parsed = JSON.parse(detailsJson) as RawCustomizationDetail[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((detail) => createCustomizationDetail(
        typeof detail.label === 'string' ? detail.label : '',
        typeof detail.value === 'string' ? detail.value : '',
      ))
      .filter(hasDisplayableCustomization);
  } catch {
    return [];
  }
}

function parseCustomizationSummary(summary: string): OrderCustomizationDetail[] {
  return summary
    .split('|')
    .map((part) => createCustomizationDetail('', part))
    .filter(hasDisplayableCustomization);
}

function createCustomizationDetail(label: string, value: string): OrderCustomizationDetail {
  const imageUrls = extractMediaUrls(value).map(resolveMediaUrl);
  const text = stripMediaUrls(value);

  return {
    label: label.trim(),
    text,
    imageUrls: dedupe(imageUrls),
  };
}

function extractMediaUrls(value: string): string[] {
  return [...value.matchAll(/(?:https?:\/\/|\/uploads\/)[^\s|]+/gi)]
    .map((match) => trimUrlPunctuation(match[0]))
    .filter(Boolean);
}

function stripMediaUrls(value: string): string {
  return value
    .replace(/(?:https?:\/\/|\/uploads\/)[^\s|]+/gi, '')
    .replace(/\s*\|\s*/g, ' ')
    .replace(/(?:صورة مرفقة|صورة)\s*:?\s*/g, '')
    .replace(/\s+\+\s*$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function trimUrlPunctuation(url: string): string {
  return url.replace(/[),.،؛]+$/g, '');
}

function hasDisplayableCustomization(detail: OrderCustomizationDetail): boolean {
  return Boolean(detail.text || detail.imageUrls.length > 0);
}

function dedupe(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
