import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faCheck, 
    faSchool, 
    faCalendarAlt, 
    faLayerGroup,
    faMagic
} from '@fortawesome/free-solid-svg-icons';
import { classService } from '../../services/classService';
import { COLORS } from '../../constants/colors';

const AddClassForm = ({ show, onClose, onAdd }) => {
    const defaultState = {
        class_name: '',
        section: '',
        academic_year: '2025-2026',
        status: 'ACTIVE'
    };

    const [formData, setFormData] = useState(defaultState);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.class_name || !formData.section) {
            alert("Please fill in Class Name and Section");
            return;
        }

        setLoading(true);
        try {
            await classService.createClass(formData);
            onAdd();
            handleClose();
        } catch (error) {
            console.error("Error creating class:", error);
            alert("Failed to create class. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData(defaultState);
        onClose();
    };

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[1999]" onClick={handleClose} />
            
            <div className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-[2000] flex flex-col transition-all duration-300">
                
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                            <FontAwesomeIcon icon={faSchool} className="text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-2xl text-gray-900 tracking-tight">Add New Class</h3>
                            <p className="text-gray-500 text-sm font-medium">Define a new academic division</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-6">
                        <div className="relative group">
                            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest ml-1">Class Name / Grade</label>
                            <div className="relative flex items-center">
                                <FontAwesomeIcon icon={faSchool} className="absolute left-4 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 10, 12, Grade 7"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-gray-800"
                                    value={formData.class_name || ""}
                                    onChange={(e) => setFormData({...formData, class_name: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest ml-1">Section</label>
                            <div className="relative flex items-center">
                                <FontAwesomeIcon icon={faLayerGroup} className="absolute left-4 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. A, B, Ruby, Emerald"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-gray-800"
                                    value={formData.section || ""}
                                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest ml-1">Academic Year</label>
                            <div className="relative flex items-center">
                                <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-4 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 2025-2026"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-gray-800"
                                    value={formData.academic_year || ""}
                                    onChange={(e) => setFormData({...formData, academic_year: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest ml-1">Initial Status</label>
                            <select
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-gray-800 appearance-none cursor-pointer"
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </div>
                    </div>

                    <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <div className="flex gap-4">
                            <FontAwesomeIcon icon={faMagic} className="text-indigo-600 mt-1" />
                            <div>
                                <p className="text-sm font-bold text-indigo-900 mb-1">Definition Tip</p>
                                <p className="text-xs text-indigo-700 leading-relaxed font-medium">Defining classes correctly helps in organizing student lists and bus routes more efficiently.</p>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-8 border-t border-gray-100 bg-white">
                    <button
                        type="submit"
                        disabled={loading}
                        onClick={handleSubmit}
                        className="w-full py-4 rounded-xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                        style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                    >
                        {loading ? "Creating..." : "Register Class"}
                        {!loading && <FontAwesomeIcon icon={faCheck} />}
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddClassForm;
