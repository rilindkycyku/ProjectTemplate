import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import Mesazhi from "../layout/Mesazhi";
import { TailSpin } from 'react-loader-spinner';
import EditoPerdorues from "./EditoPerdorues";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faUsers } from '@fortawesome/free-solid-svg-icons';
import Rolet from "./Rolet/Rolet";
import CustomTable from "../layout/CustomTable";

function TabelaEPerdoruesve() {
    const [perdoruesit, setPerdoruesit] = useState([]);
    const [perditeso, setPerditeso] = useState('');
    const [edito, setEdito] = useState(false);
    const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
    const [tipiMesazhit, setTipiMesazhit] = useState("");
    const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState("");
    const [mbyllRolet, setMbyllRolet] = useState(true);
    const [id, setId] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const shfaqPerdoruesit = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get("/Perdoruesi/shfaqPerdoruesit");
                setPerdoruesit(
                    response.data.map((k) => ({
                        ID: k.perdoruesi.aspNetUserId,
                        "Emri & Mbiemri": `${k.perdoruesi.emri} ${k.perdoruesi.mbiemri}`,
                        "Username": `@${k.perdoruesi.username}`,
                        "Email": k.perdoruesi.email,
                        "Rolet": (k.rolet ?? []).join(", ") || "—",
                    }))
                );
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        shfaqPerdoruesit();
    }, [perditeso]);

    const handleEdito = (id) => {
        setEdito(true);
        setId(id);
    };

    return (
        <div className="flex flex-col h-full w-full relative z-0">
            {mbyllRolet === false && (
                <Rolet
                    setMbyllRolet={() => setMbyllRolet(true)}
                    setPerditeso={() => setPerditeso(Date.now())}
                />
            )}

            {shfaqMesazhin && (
                <Mesazhi
                    setShfaqMesazhin={setShfaqMesazhin}
                    pershkrimi={pershkrimiMesazhit}
                    tipi={tipiMesazhit}
                />
            )}

            {edito && (
                <EditoPerdorues
                    largo={() => setEdito(false)}
                    id={id}
                    shfaqmesazhin={() => setShfaqMesazhin(true)}
                    perditesoTeDhenat={() => setPerditeso(Date.now())}
                    setTipiMesazhit={setTipiMesazhit}
                    setPershkrimiMesazhit={setPershkrimiMesazhit}
                />
            )}

            {loading ? (
                <div className="flex justify-center items-center py-20 w-full h-full">
                    <TailSpin height="60" width="60" color="#6366f1" visible={true} />
                </div>
            ) : (
                mbyllRolet && (
                    <CustomTable
                        data={perdoruesit}
                        title="User Directory"
                        icon={faUsers}
                        mosShfaqID={true}
                        kaButona={true}
                        funksionButonEdit={(id) => handleEdito(id)}
                        actions={(
                            <button
                                className="btn-premium py-2 px-5 text-sm flex items-center gap-2"
                                onClick={() => setMbyllRolet(false)}
                            >
                                <FontAwesomeIcon icon={faUserShield} /> Manage Roles
                            </button>
                        )}
                        itemsPerPage={10}
                    />
                )
            )}
        </div>
    );
};

export default TabelaEPerdoruesve;
