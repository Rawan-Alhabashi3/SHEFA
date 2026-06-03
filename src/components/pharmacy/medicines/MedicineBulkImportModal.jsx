import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import { executeMedicineImport, previewMedicineImport } from '../../../services/pharmacyService';
import { CheckCircle, AlertCircle, XCircle, Upload, FileArchive, Loader2 } from 'lucide-react';

function MedicineBulkImportModal({ open, onClose, onComplete }) {
  const { t } = useTranslation('pharmacy');
  const [step, setStep] = useState('upload');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== 'application/zip' && !selected.name.endsWith('.zip')) {
        setError('Please select a ZIP file');
        return;
      }
      if (selected.size > 100 * 1024 * 1024) {
        setError('File size must not exceed 100 MB');
        return;
      }
      setFile(selected);
      setError('');
    }
  };

  const handlePreview = async () => {
    if (!file) return;

    setUploading(true);
    setError('');
    setPreview(null);

    try {
      const result = await previewMedicineImport(file);
      setPreview(result);
      setStep('preview');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to validate import file');
    } finally {
      setUploading(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setError('');

    try {
      const result = await executeMedicineImport(file);
      setSummary(result.summary);
      setStep('complete');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to import medicines');
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setStep('upload');
    setFile(null);
    setPreview(null);
    setError('');
    setSummary(null);
    onClose();
    if (step === 'complete') {
      onComplete();
    }
  };

  const getRowStatusIcon = (status) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-rose-500" />;
      default:
        return null;
    }
  };

  if (!open) return null;

  return (
    <Modal
      title="Bulk Import Medicines"
      onClose={handleClose}
      className="min-w-3xl max-h-[90vh]"
      bodyClassName="flex flex-col max-h-[calc(90vh-4rem)]"
    >
      <div className="flex-1 overflow-y-auto p-4">
        {step === 'upload' && (
          <div className="space-y-4">
            <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-8 text-center">
              <FileArchive className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Upload ZIP File
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                The ZIP must contain medicines.xlsx and an images/ folder
              </p>
              <input
                type="file"
                accept=".zip"
                onChange={handleFileSelect}
                className="hidden"
                id="zip-upload"
              />
              <label
                htmlFor="zip-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer transition"
              >
                <Upload size={16} />
                Select ZIP File
              </label>
              {file && (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 p-4">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                ZIP Structure Example:
              </h4>
              <pre className="text-xs text-blue-800 dark:text-blue-200 font-mono">
medicines-import.zip
├── medicines.csv
└── images/
    ├── panadol.jpg
    ├── augmentin.jpg
    └── ventolin.jpg
              </pre>
            </div>

            {error && (
              <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 p-4">
                <p className="text-sm text-rose-700 dark:text-rose-200">{error}</p>
              </div>
            )}
          </div>
        )}

        {step === 'preview' && preview && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4 text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{preview.total}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Rows</p>
              </div>
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{preview.valid}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Valid</p>
              </div>
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 p-4 text-center">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{preview.warnings}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Warnings</p>
              </div>
              <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 p-4 text-center">
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{preview.errors}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Errors</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Row</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Status</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.map((row, idx) => (
                      <tr key={idx} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{row.row}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            {getRowStatusIcon(row.status)}
                            <span className="capitalize text-slate-700 dark:text-slate-300">{row.status}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          {row.errors?.length > 0 && (
                            <ul className="text-xs text-rose-600 dark:text-rose-400 list-disc list-inside">
                              {row.errors.map((err, i) => <li key={i}>{err}</li>)}
                            </ul>
                          )}
                          {row.warnings?.length > 0 && (
                            <ul className="text-xs text-amber-600 dark:text-amber-400 list-disc list-inside">
                              {row.warnings.map((warn, i) => <li key={i}>{warn}</li>)}
                            </ul>
                          )}
                          {row.errors?.length === 0 && row.warnings?.length === 0 && (
                            <span className="text-xs text-slate-400">No issues</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 p-4">
                <p className="text-sm text-rose-700 dark:text-rose-200">{error}</p>
              </div>
            )}
          </div>
        )}

        {step === 'complete' && summary && (
          <div className="space-y-4">
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-6 text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                Import Completed Successfully
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Your medicines have been imported
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4 text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{summary.imported}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">New Medicines</p>
              </div>
              <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 p-4 text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{summary.updated}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Updated</p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4 text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{summary.total_processed}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Processed</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div className="flex justify-end gap-2">
          {step === 'upload' && (
            <>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handlePreview} disabled={!file || uploading}>
                {uploading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Validating...
                  </span>
                ) : (
                  'Preview Import'
                )}
              </Button>
            </>
          )}

          {step === 'preview' && (
            <>
              <Button variant="secondary" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button
                onClick={handleImport}
                disabled={preview.errors > 0 || importing}
                variant={preview.errors > 0 ? 'secondary' : 'primary'}
              >
                {importing ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Importing...
                  </span>
                ) : (
                  `Import ${preview.valid} Medicines`
                )}
              </Button>
            </>
          )}

          {step === 'complete' && (
            <Button onClick={handleClose}>
              Done
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default MedicineBulkImportModal;
