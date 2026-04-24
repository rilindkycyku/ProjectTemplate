import { useState } from "react";
import apiClient from "../../../api/apiClient";
import CustomModal from "../../layout/CustomModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

function ShtoRolin(props) {
    const [emri, setEmri] = useState("");

    function handleSubmit(e) {
        e?.preventDefault();
        apiClient.post(`/Authenticate/shtoRolin?roli=${emri}`, {})
            .then(() => {
                props.setTipiMesazhit("success");
                props.setPershkrimiMesazhit("Role created successfully!");
                props.perditesoTeDhenat();
                props.largo();
                props.shfaqmesazhin();
            })
            .catch((error) => {
                console.error(error);
                props.setTipiMesazhit("danger");
                props.setPershkrimiMesazhit("Error creating role.");
                props.shfaqmesazhin();
            });
    }

    return (
        <CustomModal
            show={true}
            onHide={props.largo}
            title="Create New Role"
            size="sm"
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
                        <FontAwesomeIcon icon={faPlus} /> Create
                    </button>
                </>
            }
        >
            <form onSubmit={handleSubmit}>
                <label className="text-[0.7rem] font-bold uppercase tracking-widest text-text-muted mb-2 block">
                    Role Name
                </label>
                <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary-light/50 focus:ring-2 focus:ring-primary/20 placeholder:text-white/20 transition-all"
                    placeholder="e.g. Moderator"
                    value={emri}
                    onChange={(e) => setEmri(e.target.value)}
                    autoFocus
                    required
                />
            </form>
        </CustomModal>
    );
}

export default ShtoRolin;
