import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCheck, faClose, faEye, faEyeSlash, faUserCircle, faMapLocationDot, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../Context/AuthContext";
import CustomModal from "../layout/CustomModal";

function PerditesoTeDhenat(props) {
    const [teDhenat, setTeDhenat] = useState(null);
    const [loading, setLoading] = useState(true);

    const [editoTeDhenat, setEditoTeDhenat] = useState(false);
    const [editoAdresen, setEditoAdresen] = useState(false);
    const [editoFjalekalimin, setEditoFjalekalimin] = useState(false);

    const [fjalekalimiAktual, setFjalekalimiAktual] = useState("");
    const [fjalekalimiIRi, setFjalekalimiIRi] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { user, token } = useAuth();

    const [formValue, setFormValue] = useState({
        emri: "", mbiemri: "", email: "", username: "",
        nrKontaktit: "", qyteti: "", zipKodi: "", adresa: "", shteti: ""
    });

    useEffect(() => {
        if (!token) { navigate("/login"); return; }
        const vendosTeDhenat = async () => {
            try {
                const res = await apiClient.get(`/Perdoruesi/shfaqSipasID?idUserAspNet=${user.id}`);
                setTeDhenat(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        if (user?.id) {
            vendosTeDhenat();
        }
    }, [user, token, navigate]);

    useEffect(() => {
        if (teDhenat?.perdoruesi) {
            const p = teDhenat.perdoruesi;
            const d = p.teDhenatPerdoruesit;
            setFormValue({
                emri: p.emri || "", mbiemri: p.mbiemri || "", email: p.email || "", username: p.username || "",
                nrKontaktit: d?.nrKontaktit || "", qyteti: d?.qyteti || "",
                zipKodi: d?.zipKodi || "", adresa: d?.adresa || "", shteti: d?.shteti || ""
            });
        }
    }, [teDhenat]);

    const handleSave = async (type) => {
        try {
            const userId = teDhenat.perdoruesi.userId;
            
            if (type === 'personal') {
                await apiClient.put(`/Perdoruesi/perditesoPerdorues/${userId}`, {
                    emri: formValue.emri, mbiemri: formValue.mbiemri,
                    email: formValue.email, username: formValue.username,
                    teDhenatPerdoruesit: { nrKontaktit: formValue.nrKontaktit }
                });
                setEditoTeDhenat(false);
            } else if (type === 'address') {
                await apiClient.put(`/Perdoruesi/perditesoPerdorues/${userId}`, {
                    teDhenatPerdoruesit: {
                        nrKontaktit: formValue.nrKontaktit, qyteti: formValue.qyteti,
                        zipKodi: formValue.zipKodi, adresa: formValue.adresa, shteti: formValue.shteti
                    }
                });
                setEditoAdresen(false);
            } else if (type === 'password') {
                await apiClient.post(`/Perdoruesi/NdryshoFjalekalimin?AspNetID=${user.id}&fjalekalimiAktual=${fjalekalimiAktual}&fjalekalimiIRi=${fjalekalimiIRi}`);
                setEditoFjalekalimin(false);
                setFjalekalimiAktual(""); setFjalekalimiIRi("");
            }
            
            if (props.perditeso) props.perditeso();
            props.setPershkrimiMesazhit("<strong>Changes saved successfully!</strong>");
            props.setTipiMesazhit("success");
            props.setShfaqMesazhin();
        } catch (err) {
            props.setPershkrimiMesazhit("<strong>Error saving changes.</strong> Please check your input.");
            props.setTipiMesazhit("danger");
            props.setShfaqMesazhin();
        }
    };

    return (
        <CustomModal
            show={true}
            onHide={() => props.setMbyllPerditesoTeDhenat()}
            title="Update Profile"
            size="lg"
        >
            {loading ? (
                <div className="flex justify-center p-8"><TailSpin height="50" width="50" color="#6366f1" /></div>
            ) : (
                <div className="flex flex-col gap-8">
                    {/* Personal Info */}
                    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl relative">
                        <div className="flex flex-wrap justify-between items-center gap-2 mb-6 border-b border-white/5 pb-4">
                            <h4 className="m-0 text-white font-bold flex items-center gap-2 text-[1rem] md:text-[1.1rem] min-w-0 truncate">
                                <FontAwesomeIcon icon={faUserCircle} className="text-primary-light" />
                                Personal Information
                            </h4>
                            {!editoTeDhenat ? (
                                <button className="btn-outline py-1.5 px-4 text-xs font-bold uppercase tracking-wider" onClick={() => setEditoTeDhenat(true)}>
                                    <FontAwesomeIcon icon={faPenToSquare} /> Edit
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button className="btn-premium py-1.5 px-4 text-xs font-bold uppercase tracking-wider" onClick={() => handleSave('personal')}>
                                        <FontAwesomeIcon icon={faCheck} /> Save
                                    </button>
                                    <button className="btn-outline py-1.5 px-4 text-xs font-bold uppercase tracking-wider border-red-500 text-red-400 hover:bg-red-500 hover:text-white" onClick={() => setEditoTeDhenat(false)}>
                                        <FontAwesomeIcon icon={faClose} /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="form-group-premium">
                                <label>First Name</label>
                                <input disabled={!editoTeDhenat} value={formValue.emri} onChange={e => setFormValue({...formValue, emri: e.target.value})} className="form-control-premium" />
                            </div>
                            <div className="form-group-premium">
                                <label>Last Name</label>
                                <input disabled={!editoTeDhenat} value={formValue.mbiemri} onChange={e => setFormValue({...formValue, mbiemri: e.target.value})} className="form-control-premium" />
                            </div>
                            <div className="form-group-premium">
                                <label>Email</label>
                                <input disabled={!editoTeDhenat} value={formValue.email} onChange={e => setFormValue({...formValue, email: e.target.value})} className="form-control-premium" />
                            </div>
                            <div className="form-group-premium">
                                <label>Phone</label>
                                <input disabled={!editoTeDhenat} value={formValue.nrKontaktit} onChange={e => setFormValue({...formValue, nrKontaktit: e.target.value})} className="form-control-premium" />
                            </div>
                        </div>
                    </div>

                    {/* Address Details */}
                    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl relative">
                        <div className="flex flex-wrap justify-between items-center gap-2 mb-6 border-b border-white/5 pb-4">
                            <h4 className="m-0 text-white font-bold flex items-center gap-2 text-[1rem] md:text-[1.1rem] min-w-0 truncate">
                                <FontAwesomeIcon icon={faMapLocationDot} className="text-secondary-light" />
                                Address Details
                            </h4>
                            {!editoAdresen ? (
                                <button className="btn-outline py-1.5 px-4 text-xs font-bold uppercase tracking-wider" onClick={() => setEditoAdresen(true)}>
                                    <FontAwesomeIcon icon={faPenToSquare} /> Edit
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button className="btn-premium py-1.5 px-4 text-xs font-bold uppercase tracking-wider" onClick={() => handleSave('address')}>
                                        <FontAwesomeIcon icon={faCheck} /> Save
                                    </button>
                                    <button className="btn-outline py-1.5 px-4 text-xs font-bold uppercase tracking-wider border-red-500 text-red-400 hover:bg-red-500 hover:text-white" onClick={() => setEditoAdresen(false)}>
                                        <FontAwesomeIcon icon={faClose} /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            <div className="form-group-premium md:col-span-2 lg:col-span-2">
                                <label>Street Address</label>
                                <input disabled={!editoAdresen} value={formValue.adresa} onChange={e => setFormValue({...formValue, adresa: e.target.value})} className="form-control-premium" />
                            </div>
                            <div className="form-group-premium">
                                <label>City</label>
                                <input disabled={!editoAdresen} value={formValue.qyteti} onChange={e => setFormValue({...formValue, qyteti: e.target.value})} className="form-control-premium" />
                            </div>
                            <div className="form-group-premium">
                                <label>State/Province</label>
                                <input disabled={!editoAdresen} value={formValue.shteti} onChange={e => setFormValue({...formValue, shteti: e.target.value})} className="form-control-premium" />
                            </div>
                            <div className="form-group-premium">
                                <label>ZIP Code</label>
                                <input disabled={!editoAdresen} value={formValue.zipKodi} onChange={e => setFormValue({...formValue, zipKodi: e.target.value})} className="form-control-premium" />
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl relative">
                        <div className="flex flex-wrap justify-between items-center gap-2 mb-6 border-b border-white/5 pb-4">
                            <h4 className="m-0 text-white font-bold flex items-center gap-2 text-[1rem] md:text-[1.1rem] min-w-0 truncate">
                                <FontAwesomeIcon icon={faShieldHalved} className="text-amber-400" />
                                Security
                            </h4>
                            {!editoFjalekalimin ? (
                                <button className="btn-outline py-1.5 px-4 text-xs font-bold uppercase tracking-wider" onClick={() => setEditoFjalekalimin(true)}>
                                    <FontAwesomeIcon icon={faPenToSquare} /> Change Password
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button className="btn-premium py-1.5 px-4 text-xs font-bold uppercase tracking-wider" onClick={() => handleSave('password')}>
                                        <FontAwesomeIcon icon={faCheck} /> Update
                                    </button>
                                    <button className="btn-outline py-1.5 px-4 text-xs font-bold uppercase tracking-wider border-red-500 text-red-400 hover:bg-red-500 hover:text-white" onClick={() => setEditoFjalekalimin(false)}>
                                        <FontAwesomeIcon icon={faClose} /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {editoFjalekalimin && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" data-aos="fade-down" data-aos-duration="300">
                                <div className="form-group-premium">
                                    <label>Current Password</label>
                                    <div className="relative">
                                        <input type={showPassword ? "text" : "password"} value={fjalekalimiAktual} onChange={e => setFjalekalimiAktual(e.target.value)} className="form-control-premium w-full pr-10" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group-premium">
                                    <label>New Password</label>
                                    <div className="relative">
                                        <input type={showPassword ? "text" : "password"} value={fjalekalimiIRi} onChange={e => setFjalekalimiIRi(e.target.value)} className="form-control-premium w-full pr-10" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </CustomModal>
    );
}

export default PerditesoTeDhenat;
