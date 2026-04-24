import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import CustomModal from "../layout/CustomModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';

function EditoPerdorues(props) {
    const [perdoruesi, setPerdoruesi] = useState(null);
    const [shfaqRolet, setShfaqRolet] = useState([]);
    const [roletUseri, setRoletUseri] = useState([]);
    const [roletSelektim, setRoletSelektim] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await apiClient.get(`/Perdoruesi/shfaqSipasID?idUserAspNet=${props.id}`);
                setPerdoruesi(userRes.data);
                setRoletUseri(userRes.data.rolet);
                setRoletSelektim(userRes.data.rolet);

                const rolesRes = await apiClient.get(`/Authenticate/shfaqRolet`);
                setShfaqRolet(rolesRes.data);
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, [props.id]);

    async function handleSubmit() {
        try {
            for (const y of roletUseri) {
                if (y !== 'User' && !roletSelektim.includes(y)) {
                    await apiClient.delete(`/Authenticate/FshijRolinUserit?userID=${props.id}&roli=${y}`);
                }
            }
            for (const y of roletSelektim) {
                if (y !== 'User' && !roletUseri.includes(y)) {
                    await apiClient.post(`/Authenticate/ShtoRolinPerdoruesit?userID=${props.id}&roli=${y}`, {});
                }
            }
            props.perditesoTeDhenat();
            props.largo();
            props.setTipiMesazhit("success");
            props.setPershkrimiMesazhit("User access permissions updated successfully!");
            props.shfaqmesazhin();
        } catch (error) {
            console.error(error);
            props.setTipiMesazhit("danger");
            props.setPershkrimiMesazhit("An error occurred while updating permissions.");
            props.shfaqmesazhin();
        }
    }

    const toggleRole = (roleName) => {
        if (roleName === 'User') return; // always assigned
        setRoletSelektim(prev =>
            prev.includes(roleName)
                ? prev.filter(r => r !== roleName)
                : [...prev, roleName]
        );
    };

    return (
        <CustomModal
            show={true}
            onHide={props.largo}
            title={<><FontAwesomeIcon icon={faUserShield} className="text-primary-light" /> Edit User Permissions</>}
            footer={
                <>
                    <button
                        className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-text-muted hover:text-white hover:bg-white/10 transition-all text-sm font-medium flex items-center gap-2"
                        onClick={props.largo}
                    >
                        <FontAwesomeIcon icon={faXmark} /> Cancel
                    </button>
                    <button
                        className="btn-premium py-2 px-5 text-sm flex items-center gap-2"
                        onClick={handleSubmit}
                    >
                        <FontAwesomeIcon icon={faCheck} /> Save Changes
                    </button>
                </>
            }
        >
            <div className="mb-5">
                <p className="text-[0.7rem] font-bold uppercase tracking-widest text-text-muted mb-1">User Identity</p>
                <h5 className="text-white font-bold text-lg m-0">
                    {perdoruesi?.perdoruesi?.emri} {perdoruesi?.perdoruesi?.mbiemri}
                </h5>
                <p className="text-text-muted text-sm m-0">{perdoruesi?.perdoruesi?.email}</p>
            </div>

            <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-widest text-text-muted mb-3">Access Roles</p>
                <div className="flex flex-wrap gap-2">
                    {shfaqRolet.map(roli => {
                        const isSelected = roletSelektim.includes(roli.name);
                        const isDisabled = roli.name === 'User';
                        return (
                            <button
                                key={roli.id}
                                onClick={() => toggleRole(roli.name)}
                                disabled={isDisabled}
                                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                                    isSelected
                                        ? 'bg-primary/20 border-primary/50 text-primary-light shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                                        : 'bg-white/5 border-white/10 text-text-muted hover:border-white/20 hover:text-white'
                                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {roli.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </CustomModal>
    );
}

export default EditoPerdorues;
