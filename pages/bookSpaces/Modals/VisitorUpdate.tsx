import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Typography,
} from '@mui/material';
import Modal from '../../../components/lib/modalPopup/components/Modal';
import ModalBody from '../../../components/lib/modalPopup/components/ModalBody';
import ModalHeader from '../../../components/lib/modalPopup/components/ModalHeader';
import ModalFooter from '../../../components/lib/modalPopup/components/ModalFooter';
import UsermanagementService from '../../../services/usermanagement.service';
import { toast } from 'react-toastify';

const Operations = ['New', 'Update'];
const idtypes = ['Driver Licence', 'Aadhar', 'SSN'];

const VisitorUpdate = ({ onClose, selectedUser }: any) => {
  const [selectedColor, setSelectedColor] = useState('New');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileno, setmobileno] = useState('');
  const [email, setEmail] = useState('');
  const [idtype, setidtype] = useState('');
  const [idvalue, setidvalue] = useState('');
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    mobileno: '',
    email: '',
  });

  const validate = () => {
    const newErrors = { firstName: '', lastName: '', mobileno: '', email: '' };

    // First Name validation (Only alphabets)
    if (!/^[A-Za-z]+$/.test(firstName)) {
      newErrors.firstName = 'First name should contain only alphabets.';
    }

    // Last Name validation (Only alphabets)
    if (!/^[A-Za-z]+$/.test(lastName)) {
      newErrors.lastName = 'Last name should contain only alphabets.';
    }

    // Phone Number validation (Only numbers)
    if (!/^\d+$/.test(mobileno)) {
      newErrors.mobileno = 'Phone number should contain only digits.';
    }

    // Email validation (Valid format)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.values(newErrors).every((error) => error === '');
  };

  // Save Handler
  const handleSave = () => {
    if (validate()) {
      const idtypeArray = [idtype]; // Wrap in an array
      const idvalueArray = [idvalue]; // Wrap in an array
      if (selectedColor === 'Update' && selectedUser) {
        UsermanagementService.updateUser({
          userId: selectedUser.userId,
          firstName,
          lastName,
          mobileno,
          email,
          idtypeArray,
          idvalueArray,
          Isvisitor: true,
         }).then(() => {
          toast.success('User updated successfully');
          onClose();
        }).catch(() => {
          toast.error('Failed to update user');
        });
        return;
      }
      UsermanagementService.addUser({
        firstName,
        lastName,
        mobileno,
        email,
        idtypeArray,
        idvalueArray,
        Isvisitor: true,
       }).then(() => {
        toast.success('User added successfully');
        onClose();
      }).catch(() => {
        toast.error('Failed to add user');
      });
      console.log('Form submitted successfully:', {
        firstName,
        lastName,
        mobileno,
        email,
        idtypeArray,
        idvalueArray,
      });
    } else {
      console.log('Validation errors:', errors);
    }
  };

  // Delete Handler
  const onDeleteClick = () => {
    UsermanagementService.deleteUser(selectedUser.userId);
    onClose();
  };

  // Populate form fields when in "Update" mode
  useEffect(() => {
    if (selectedColor === 'Update' && selectedUser) {
      setFirstName(selectedUser.firstName);
      setLastName(selectedUser.lastName);
      setmobileno(selectedUser.mobileno);
      setEmail(selectedUser.email);
      setidvalue(selectedUser.idvalue?.[0] || '');
      setidtype(selectedUser.idtype?.[0] || '');
    }
  }, [selectedColor]);

  return (
    <Modal>
      <ModalHeader></ModalHeader>
      <ModalBody>
        <Box className="p-4 bg-white rounded-lg shadow-md">
          <Grid container spacing={2}>
            {/* Operations Dropdown */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="color-label">Operations</InputLabel>
                <Select
                  labelId="color-label"
                  id="color"
                  value={selectedColor}
                  label="Operations"
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  {Operations.map((color) => (
                    <MenuItem key={color} value={color}>
                      {color}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* First Name and Last Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                id="first-name"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="last-name"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12}>
              <TextField
                id="phone-number"
                label="Phone Number with Country Code"
                value={mobileno}
                onChange={(e) => setmobileno(e.target.value)}
                fullWidth
                error={!!errors.mobileno}
                helperText={errors.mobileno}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12}>
              <TextField
                id="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            {/* ID Type */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="id-type-label">ID Type</InputLabel>
                <Select
                  labelId="id-type-label"
                  id="id-type"
                  value={idtype}
                  label="ID Type"
                  onChange={(e) => setidtype(e.target.value)}
                >
                  {idtypes.map((idtype) => (
                    <MenuItem key={idtype} value={idtype}>
                      {idtype}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* ID Number */}
            <Grid item xs={12}>
              <TextField
                id="id-number"
                label="ID Number"
                value={idvalue}
                onChange={(e) => setidvalue(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      </ModalBody>
      <ModalFooter>
        <div className="flex flex-wrap justify-end gap-4 p-4 bg-gray-100">
          {/* Buttons */}
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onDeleteClick}
            disabled={selectedColor === 'New'}
          >
            Delete
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default VisitorUpdate;