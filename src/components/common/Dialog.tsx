import React from 'react';

type DialogSize = 'sm' | 'md';

interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  size?: DialogSize;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onClose: () => void;
  confirmDisabled?: boolean;
}

export function Dialog({
  open,
  title,
  description,
  size = 'md',
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onClose,
  confirmDisabled,
}: DialogProps) {
  if (!open) return null;

  const width = size === 'sm' ? 'max-w-sm' : 'max-w-md';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className={`relative w-full ${width} mx-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl`}>
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
        {children && <div className="p-5">{children}</div>}
        <div className="p-5 pt-0 flex items-center justify-end gap-2">
          <button
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={onClose}
            type="button"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              className="px-3 py-2 text-sm rounded-lg bg-primary text-white hover:opacity-90 disabled:opacity-50"
              onClick={onConfirm}
              disabled={confirmDisabled}
              type="button"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

