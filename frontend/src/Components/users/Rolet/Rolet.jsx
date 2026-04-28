import { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";
import CustomModal from "../../layout/CustomModal";
import Mesazhi from "../../layout/Mesazhi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import LargoRolin from "./LargoRolin";
import { TailSpin } from 'react-loader-spinner';

function Rolet(props) {
    const [rolet, setRolet] = useState([]);
    const [perditeso, setPerditeso] = useState('');
    const [shto, setShto] = useState(false);
    const [fshij, setFshij] = useState(false);
    const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
    const [tipiMesazhit, setTipiMesazhit] = useState("");
    const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState("");
    const [emriRolit, setEmriRolit] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const vendosRolet = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get("/Authenticate/shfaqRolet");
                setRolet(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        vendosRolet();
    }, [perditeso]);

    return (
        <>
            {/* Sub-modals — also Bootstrap Modals, render at body level */}
            {shto && <ShtoRolin
                largo={() => setShto(false)}
                shfaqmesazhin={() => setShfaqMesazhin(true)}
                perditesoTeDhenat={() => setPerditeso(Date.now())}
                setTipiMesazhit={setTipiMesazhit}
                setPershkrimiMesazhit={setPershkrimiMesazhit}
            />}
            {shfaqMesazhin && <Mesazhi
                setShfaqMesazhin={setShfaqMesazhin}
                pershkrimi={pershkrimiMesazhit}
                tipi={tipiMesazhit}
            />}
            {fshij && <LargoRolin
                largo={() => setFshij(false)}
                emriRolit={emriRolit}
                shfaqmesazhin={() => setShfaqMesazhin(true)}
                perditesoTeDhenat={() => setPerditeso(Date.now())}
                setTipiMesazhit={setTipiMesazhit}
                setPershkrimiMesazhit={setPershkrimiMesazhit}
            />}

            {/* Main Roles Modal */}
            <CustomModal
                show={true}
                onHide={props.setMbyllRolet}
                size="lg"
                title={<><FontAwesomeIcon icon={faLayerGroup} className="text-primary-light" /> System Roles</>}
                footer={
                    <button className="btn-premium py-2 px-4 text-sm flex items-center gap-2" onClick={() => setShto(true)}>
                        <FontAwesomeIcon icon={faPlus} /> Create Role
                    </button>
                }
            >
                {loading ? (
                    <div className="flex justify-center py-8">
                        <TailSpin height="50" width="50" color="#6366f1" />
                    </div>
                ) : (
                    <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                        <thead>
                            <tr className="border-b border-white/8 text-text-muted text-xs uppercase tracking-wider">
                                <th className="p-3 font-semibold text-left">Role Name</th>
                                <th className="p-3 font-semibold text-left">Active Users</th>
                                <th className="p-3 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rolet.map((r) => (
                                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="font-bold text-white p-3">{r.name}</td>
                                    <td className="text-text-muted p-3">{r.totaliPerdoruesve || 0} users</td>
                                    <td className="p-3 text-center">
                                        <button
                                            style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#f87171', cursor: 'pointer', transition: 'all 0.2s' }}
                                            onClick={() => { setEmriRolit(r.name); setFshij(true); }}
                                            disabled={['Admin', 'User'].includes(r.name)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </CustomModal>
        </>
    );
};

export default Rolet;
