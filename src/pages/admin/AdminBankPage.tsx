interface Bank {
  id?: string | number;
  name: string;
  branches?: string[];
  accountType?: string;
}

interface AccountType {
  id: string | number;
  name: string;
  description?: string;
}
interface BusinessType {
  id: string | number;
  name: string;
  description?: string;
}
interface OwnershipType {
  id: string | number;
  name: string;
  description?: string;
}


import { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import { Button } from '../../components/ui/button';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


type FormType = 'bank' | 'accountType' | 'businessType' | 'ownershipType';

const actions: { label: string; type: FormType }[] = [
  { label: 'Add Bank', type: 'bank' },
  { label: 'Add Account Type', type: 'accountType' },
  { label: 'Add Business Type', type: 'businessType' },
  { label: 'Add Ownership Type', type: 'ownershipType' },
];

const initialFormState = {
  bank: { name: '', branches: [''] },
  accountType: { name: '' },
  businessType: { name: '' },
  ownershipType: { name: '' },
};

const AdminBankPage = () => {
  const api = apiService();
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState<FormType>('bank');
  const [formData, setFormData] = useState<any>(initialFormState.bank);
  const [data, setData] = useState<{
    banks: Bank[];
    accountTypes: AccountType[];
    businessTypes: BusinessType[];
    ownershipTypes: OwnershipType[];
  }>({
    banks: [],
    accountTypes: [],
    businessTypes: [],
    ownershipTypes: [],
  });
  const [editId, setEditId] = useState<null | string | number>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      let banks = await api.sendPostToServer('businesses/banks', {});
      let accountTypes = await api.sendPostToServer('businesses/account-types', {});
      let businessTypes = await api.sendPostToServer('businesses/business-types', {});
      let ownershipTypes = await api.sendPostToServer('businesses/ownership-types', {});

      let banksArr: Bank[] = Array.isArray(banks) ? banks : ((banks as any)?.data ?? []);
      banksArr = banksArr.map((bank: any) => {
        let branches = bank.branches;
        if (typeof branches === 'string') {
          try {
            let parsed = JSON.parse(branches);
            if (typeof parsed === 'string') {
              parsed = JSON.parse(parsed);
            }
            if (Array.isArray(parsed)) {
              branches = parsed;
            } else {
              branches = [branches];
            }
          } catch {
            branches = [branches];
          }
        }
        if (!Array.isArray(branches)) {
          branches = [branches];
        }
        branches = branches.map((b: any) => String(b));
        return { ...bank, branches };
      });
      const accountTypesArr: AccountType[] = Array.isArray(accountTypes) ? accountTypes : ((accountTypes as any)?.data ?? []);
      const businessTypesArr: BusinessType[] = Array.isArray(businessTypes) ? businessTypes : ((businessTypes as any)?.data ?? []);
      const ownershipTypesArr: OwnershipType[] = Array.isArray(ownershipTypes) ? ownershipTypes : ((ownershipTypes as any)?.data ?? []);

      setData({ banks: banksArr, accountTypes: accountTypesArr, businessTypes: businessTypesArr, ownershipTypes: ownershipTypesArr });
    } catch (error) {}
  };



  const handleOpen = (type: FormType, item: any = null) => {
    setFormType(type);
    setOpen(true);
    if (item) {
      setEditId(item.id);
      // Ensure branches is always an array for banks
      if (type === 'bank') {
        setFormData({ ...item, branches: Array.isArray(item.branches) ? item.branches : (item.branches ? [item.branches] : ['']) });
      } else {
        setFormData(item);
      }
    } else {
      setEditId(null);
      setFormData(initialFormState[type]);
    }
  };


  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormState[formType]);
    setEditId(null);
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    // If editing a bank and changing branches, keep branches as array
    if (formType === 'bank' && e.target.name.startsWith('branch-')) {
      const idx = parseInt(e.target.name.replace('branch-', ''), 10);
      const newBranches = Array.isArray(formData.branches) ? [...formData.branches] : [''];
      newBranches[idx] = e.target.value;
      setFormData({ ...formData, branches: newBranches });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      let endpoint = '';
      switch (formType) {
        case 'bank':
          endpoint = editId ? 'businesses/banks/update' : 'businesses/banks/create';
          break;
        case 'accountType':
          endpoint = editId ? 'businesses/account-types/update' : 'businesses/account-types/create';
          break;
        case 'businessType':
          endpoint = editId ? 'businesses/business-types/update' : 'businesses/business-types/create';
          break;
        case 'ownershipType':
          endpoint = editId ? 'businesses/ownership-types/update' : 'businesses/ownership-types/create';
          break;
        default:
          break;
      }
      if (editId) {
        await api.sendPostToServer(endpoint, { id: editId, ...formData });
      } else {
        await api.sendPostToServer(endpoint, formData);
      }
      fetchData();
      handleClose();
    } catch (error) {}
  };


  const handleDelete = async (type: FormType, id: string | number) => {
    try {
      let endpoint = '';
      let payload: any = {};
      switch (type) {
        case 'bank':
          endpoint = 'businesses/banks/delete';
          payload = { bankId: id };
          break;
        case 'accountType':
          endpoint = 'businesses/account-types/delete';
          payload = { accountTypeId: id };
          break;
        case 'businessType':
          endpoint = 'businesses/business-types/delete';
          payload = { businessTypeId: id };
          break;
        case 'ownershipType':
          endpoint = 'businesses/ownership-types/delete';
          payload = { ownershipTypeId: id };
          break;
        default:
          break;
      }
      await api.sendPostToServer(endpoint, payload);
      fetchData();
    } catch (error) {}
  };


  const filteredBanks = data.banks.filter(bank =>
    (bank.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (Array.isArray(bank.branches) ? bank.branches.some(b => (b?.toLowerCase() || '').includes(searchTerm.toLowerCase())) : false)
  );
  const filteredAccountTypes = data.accountTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (type.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredBusinessTypes = data.businessTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (type.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredOwnershipTypes = data.ownershipTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (type.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-700">Master Data Management</h1>
            <p className="text-base text-gray-600 mt-1">View, add, edit, and delete banks, account types, business types, and ownership types</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {actions.map((action) => (
              <Button
                key={action.type}
                onClick={() => handleOpen(action.type)}
                className="bg-green-600 hover:bg-green-700 text-white shadow"
                style={{ minWidth: 140 }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Banks Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-green-700">Banks</h2>
              <div className="relative w-56">
                <input
                  type="text"
                  placeholder="Search banks or branches..."
                  className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Branches</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBanks.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No banks to display</td>
                    </tr>
                  ) : (
                    filteredBanks.map((bank, idx) => (
                      <tr key={bank.id || bank.name + idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{bank.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {Array.isArray(bank.branches) && bank.branches.length > 0
                            ? bank.branches.map((b, i) => <div key={i}>{b}</div>)
                            : <span className="text-gray-400">No branches</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => handleOpen('bank', bank)} className="text-xs px-3 py-1 rounded flex items-center bg-green-100 text-green-700 hover:bg-green-200 focus:ring-2 focus:ring-green-400">
                              <EditIcon className="h-4 w-4 mr-1" /> Edit
                            </button>
                            <button onClick={() => handleDelete('bank', bank.id || bank.name + idx)} className="text-xs px-3 py-1 rounded flex items-center bg-red-100 text-red-700 hover:bg-red-200 focus:ring-2 focus:ring-red-400">
                              <DeleteIcon className="h-4 w-4 mr-1" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Account Types Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Account Types</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAccountTypes.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-center text-gray-500">No account types to display</td>
                    </tr>
                  ) : (
                    filteredAccountTypes.map((type) => (
                      <tr key={type.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{type.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => handleOpen('accountType', type)} className="text-xs px-3 py-1 rounded flex items-center bg-green-100 text-green-700 hover:bg-green-200 focus:ring-2 focus:ring-green-400">
                              <EditIcon className="h-4 w-4 mr-1" /> Edit
                            </button>
                            <button onClick={() => handleDelete('accountType', type.id)} className="text-xs px-3 py-1 rounded flex items-center bg-red-100 text-red-700 hover:bg-red-200 focus:ring-2 focus:ring-red-400">
                              <DeleteIcon className="h-4 w-4 mr-1" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Business Types Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Business Types</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBusinessTypes.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-center text-gray-500">No business types to display</td>
                    </tr>
                  ) : (
                    filteredBusinessTypes.map((type) => (
                      <tr key={type.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{type.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => handleOpen('businessType', type)} className="text-xs px-3 py-1 rounded flex items-center bg-green-100 text-green-700 hover:bg-green-200 focus:ring-2 focus:ring-green-400">
                              <EditIcon className="h-4 w-4 mr-1" /> Edit
                            </button>
                            <button onClick={() => handleDelete('businessType', type.id)} className="text-xs px-3 py-1 rounded flex items-center bg-red-100 text-red-700 hover:bg-red-200 focus:ring-2 focus:ring-red-400">
                              <DeleteIcon className="h-4 w-4 mr-1" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Ownership Types Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Ownership Types</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOwnershipTypes.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-center text-gray-500">No ownership types to display</td>
                    </tr>
                  ) : (
                    filteredOwnershipTypes.map((type) => (
                      <tr key={type.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{type.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => handleOpen('ownershipType', type)} className="text-xs px-3 py-1 rounded flex items-center bg-green-100 text-green-700 hover:bg-green-200 focus:ring-2 focus:ring-green-400">
                              <EditIcon className="h-4 w-4 mr-1" /> Edit
                            </button>
                            <button onClick={() => handleDelete('ownershipType', type.id)} className="text-xs px-3 py-1 rounded flex items-center bg-red-100 text-red-700 hover:bg-red-200 focus:ring-2 focus:ring-red-400">
                              <DeleteIcon className="h-4 w-4 mr-1" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="!text-green-700 !font-bold">
          {editId ? 'Edit' : 'Add'}{' '}
          {(() => {
            switch (formType) {
              case 'bank': return 'Bank';
              case 'accountType': return 'Account Type';
              case 'businessType': return 'Business Type';
              case 'ownershipType': return 'Ownership Type';
              default: return '';
            }
          })()}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {formType === 'bank' && (
              <>
                <TextField
                  margin="dense"
                  label="Bank Name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <div style={{ marginTop: 16 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Branches</label>
                  {formData.branches && formData.branches.map((branch: string, idx: number) => (
                    <div key={idx} className="flex items-center mb-2 gap-2">
                      <TextField
                        margin="dense"
                        label={`Branch ${idx + 1}`}
                        name={`branch-${idx}`}
                        value={branch}
                        onChange={e => {
                          const newBranches = [...formData.branches];
                          newBranches[idx] = e.target.value;
                          setFormData({ ...formData, branches: newBranches });
                        }}
                        fullWidth
                        required
                      />
                      {formData.branches.length > 1 && (
                        <Button type="button" variant="outline" onClick={() => {
                          const newBranches = formData.branches.filter((_: string, i: number) => i !== idx);
                          setFormData({ ...formData, branches: newBranches });
                        }}>Remove</Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" className="mt-2" onClick={() => setFormData({ ...formData, branches: [...formData.branches, ''] })}>
                    Add Branch
                  </Button>
                </div>
              </>
            )}
            {formType === 'accountType' && (
              <>
                <TextField
                  margin="dense"
                  label="Account Type Name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </>
            )}
            {formType === 'businessType' && (
              <>
                <TextField
                  margin="dense"
                  label="Business Type Name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </>
            )}
            {formType === 'ownershipType' && (
              <>
                <TextField
                  margin="dense"
                  label="Ownership Type Name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outline">Cancel</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" style={{ minWidth: 90 }}>
              {editId ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default AdminBankPage;