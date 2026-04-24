import apiClient from "../../../api/apiClient";
import CustomModal from "../../layout/CustomModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';

function LargoRolin(props) {
    async function handleSubmit() {
        try {
            await apiClient.delete(`/Authenticate/fshijRolin?emriRolit=${props.emriRolit}`);
            props.setTipiMesazhit("success");
            props.setPershkrimiMesazhit("Role deleted successfully!");
            props.perditesoTeDhenat();
            props.largo();
            props.shfaqmesazhin();
        } catch (error) {
            console.error(error);
            props.setTipiMesazhit("danger");
            props.setPershkrimiMesazhit("An error occurred while deleting the role.");
            props.shfaqmesazhin();
        }
    }

    return (
        <CustomModal
            show={true}
            onHide={props.largo}
            title={<span className="text-red-400">Delete Role</span>}
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
                        className="px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 text-white transition-all"
                        style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                        onClick={handleSubmit}
                    >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                </>
            }
        >
            <p className="text-text-muted text-sm leading-relaxed m-0">
                Are you sure you want to delete the role{' '}
                <strong className="text-white">{props.emriRolit}</strong>?
                This action cannot be undone.
            </p>
        </CustomModal>
    );
}

export default LargoRolin;
