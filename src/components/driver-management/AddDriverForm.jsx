import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserPlus, faUser, faEnvelope, faPhone, faIdCard, faCalendarAlt, faPassport, faCheck, faLock, faLink, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const InputField = ({ label, icon, type = "text", placeholder, value, onChange, className = "", error, errorMessage, maxLength }) => {
    let borderColor = "border-gray-100";
    let focusColor = "focus:border-gray-400 focus:ring-gray-50";
    let iconColor = "bg-gray-100 text-gray-500";
    let textColor = "text-gray-700";

    if (error) {
        borderColor = "border-red-500";
        focusColor = "focus:border-red-500 focus:ring-red-50";
        iconColor = "bg-red-50 text-red-500";
        textColor = "text-red-600";
    }

    return (
        <div className={className}>
            <div className="flex justify-between items-center mb-2">
                <label className={`block text-xs font-bold uppercase tracking-wide ${error ? 'text-red-500' : 'text-gray-700'}`}>
                    {label}
                </label>
                {error && <span className="text-xs text-red-500 font-medium flex items-center gap-1"><FontAwesomeIcon icon={faExclamationCircle} /> {errorMessage || "Required"}</span>}
            </div>
            <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${iconColor}`}>
                    <FontAwesomeIcon icon={icon} className="text-sm" />
                </div>
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    maxLength={maxLength}
                    className={`w-full bg-white border-2 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:outline-none transition-all shadow-sm font-medium placeholder-gray-400 focus:ring-4 ${borderColor} ${focusColor} ${textColor}`}
                />
            </div>
        </div>
    );
};

const AddDriverForm = ({ show, onClose, onAdd }) => {
    const [newDriver, setNewDriver] = useState({
        name: '', phone: '', email: '', dob: '', licence_number: '',
        licence_expiry: '', aadhar_number: '', licence_url: '',
        aadhar_url: '', photo_url: '', password: ''
    });

    const [touched, setTouched] = useState({});

    // Validate a single field or all fields
    const validate = (values) => {
        const errors = {};

        if (!values.name?.trim()) errors.name = "Name is required";

        // Email is optional, separate check
        if (values.email?.trim() && !/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Invalid email format";
        }

        if (!values.phone) {
            errors.phone = "Phone is required";
        } else if (values.phone.length !== 10) {
            errors.phone = "Must be 10 digits";
        }

        if (!values.dob) errors.dob = "Date of Birth required";
        if (!values.password) errors.password = "Password required";
        if (!values.licence_number?.trim()) errors.licence_number = "License No. required";
        if (!values.licence_expiry) errors.licence_expiry = "Expiry date required";
        if (!values.aadhar_number?.trim()) errors.aadhar_number = "Aadhar No. required";
        if (!values.photo_url?.trim()) errors.photo_url = "Photo URL required";
        if (!values.licence_url?.trim()) errors.licence_url = "License Doc URL required";
        if (!values.aadhar_url?.trim()) errors.aadhar_url = "Aadhar Doc URL required";

        return errors;
    };

    const errors = validate(newDriver);
    const isValid = Object.keys(errors).length === 0;

    const handleAdd = () => {
        // Mark all as touched on submit attempt
        const allTouched = Object.keys(newDriver).reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setTouched(allTouched);

        if (isValid) {
            onAdd({
                name: newDriver.name,
                phone: Number(newDriver.phone),
                email: newDriver.email,
                licence_number: newDriver.licence_number,
                licence_expiry: newDriver.licence_expiry,
                status: 'ACTIVE', // Default status from API spec
                // Additional fields present in form but maybe not in basic JSON example, sending anyway as they are likely needed
                dob: newDriver.dob,
                aadhar_number: newDriver.aadhar_number,
                photo_url: newDriver.photo_url,
                licence_url: newDriver.licence_url,
                aadhar_url: newDriver.aadhar_url,
                password: newDriver.password
            });
            // Reset
            setNewDriver({
                name: '', phone: '', email: '', dob: '', licence_number: '',
                licence_expiry: '', aadhar_number: '', licence_url: '',
                aadhar_url: '', photo_url: '', password: ''
            });
            setTouched({});
        }
    };

    const updateField = (field, value) => {
        // Logic for "Only number can enter" for mobile
        if (field === 'phone') {
            const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-digits
            if (numericValue.length <= 10) {
                setNewDriver(prev => ({ ...prev, [field]: numericValue }));
            }
        } else {
            setNewDriver(prev => ({ ...prev, [field]: value }));
        }

        // Mark as touched on change
        if (!touched[field]) {
            setTouched(prev => ({ ...prev, [field]: true }));
        }
    };

    const generateRandomDriver = () => {
        const randomNum = Math.floor(Math.random() * 10000);
        const randomPhone = "9" + Math.floor(Math.random() * 1000000000).toString().substring(0, 9);
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 5);

        setNewDriver({
            name: `Test Driver ${randomNum}`,
            email: `driver${randomNum}@test.com`,
            phone: randomPhone,
            dob: '1990-01-01',
            licence_number: `DL-${randomNum}-XYZ`,
            licence_expiry: futureDate.toISOString().split('T')[0],
            aadhar_number: `${Math.floor(Math.random() * 10000)} 5678 9012`,
            photo_url: 'https://randomuser.me/api/portraits/men/' + (randomNum % 99) + '.jpg',
            licence_url: 'https://example.com/license.pdf',
            aadhar_url: 'https://example.com/aadhar.pdf',
            password: 'password123'
        });
        // Set all to touched to show validity (even though green is removed, errors are cleared)
        const allTouched = Object.keys(newDriver).reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setTouched(allTouched);
    };

    const handleClose = () => {
        setNewDriver({
            name: '', phone: '', email: '', dob: '', licence_number: '',
            licence_expiry: '', aadhar_number: '', licence_url: '',
            aadhar_url: '', photo_url: '', password: ''
        });
        setTouched({});
        onClose();
    };

    if (!show) return null;

    // Helper to get props for InputField
    const getFieldProps = (field) => {
        const isError = touched[field] && !!errors[field];
        // valid prop removed
        return {
            error: isError,
            errorMessage: errors[field],
            value: newDriver[field],
            onChange: (e) => updateField(field, e.target.value)
        };
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1999]" onClick={handleClose}></div>
            <div className="fixed right-0 top-0 h-full w-full md:w-[800px] bg-white shadow-2xl z-[2000] flex flex-col animate-slide-in">
                <div className="relative p-6 border-b border-gray-100 bg-white">
                    <button
                        onClick={handleClose}
                        className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-sm" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 text-gray-900 border border-gray-100 shadow-sm">
                            <FontAwesomeIcon icon={faUserPlus} className="text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-gray-900">Add New Driver</h3>
                            <p className="text-gray-500 text-sm">Create a new driver account</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-white">
                    <div className="space-y-8">
                        {/* Personal Information */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                                <span className="w-1 h-4 bg-gray-900 rounded-full"></span>
                                Personal Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <InputField label="Full Name" icon={faUser} {...getFieldProps('name')} placeholder="Enter driver's name" className="md:col-span-2" />
                                <InputField label="Email Address (Optional)" icon={faEnvelope} {...getFieldProps('email')} type="email" placeholder="driver@example.com" />
                                <InputField label="Mobile Number" icon={faPhone} {...getFieldProps('phone')} type="tel" maxLength={10} placeholder="9876543210" />
                                <InputField label="Date of Birth" icon={faCalendarAlt} {...getFieldProps('dob')} type="date" />
                                <InputField label="Password" icon={faLock} {...getFieldProps('password')} type="password" placeholder="Set account password" />
                            </div>
                        </div>

                        {/* Professional Details */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                                <span className="w-1 h-4 bg-gray-900 rounded-full"></span>
                                Professional Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <InputField label="License Number" icon={faIdCard} {...getFieldProps('licence_number')} placeholder="DL-XXXX-XXXX" />
                                <InputField label="License Expiry" icon={faCalendarAlt} {...getFieldProps('licence_expiry')} type="date" />
                                <InputField label="Aadhar Number" icon={faPassport} {...getFieldProps('aadhar_number')} placeholder="1234 5678 9012" className="md:col-span-2" />
                            </div>
                        </div>

                        {/* Documents */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                                <span className="w-1 h-4 bg-gray-900 rounded-full"></span>
                                Documents (URLs)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <InputField label="Photo URL" icon={faLink} {...getFieldProps('photo_url')} placeholder="https://..." className="md:col-span-2" />
                                <InputField label="License Document URL" icon={faLink} {...getFieldProps('licence_url')} placeholder="https://..." />
                                <InputField label="Aadhar Document URL" icon={faLink} {...getFieldProps('aadhar_url')} placeholder="https://..." />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex gap-3">
                    <button
                        onClick={generateRandomDriver}
                        className="flex-1 py-3.5 text-gray-700 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm"
                    >
                        Test Fill
                    </button>
                    <button
                        onClick={handleAdd}
                        className={`flex-[2] py-3.5 text-white rounded-xl font-bold shadow-lg transition-all text-sm flex items-center justify-center ${!isValid && Object.keys(touched).length > 0
                                ? 'bg-gray-800'
                                : 'bg-gray-900 hover:bg-black hover:shadow-xl hover:scale-[1.01]'
                            }`}
                    >
                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                        Create Driver
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddDriverForm;
