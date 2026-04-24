import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import { TailSpin } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faLayerGroup, faChartPie, faArrowTrendUp, faUserShield } from '@fortawesome/free-solid-svg-icons';
import CustomTable from "../layout/CustomTable";

const Statistika = () => {
    const [stats, setStats] = useState({ users: 0, roles: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, rolesRes] = await Promise.all([
                    apiClient.get("/Perdoruesi/shfaqPerdoruesit"),
                    apiClient.get("/Authenticate/shfaqRolet")
                ]);

                const userData = usersRes.data || [];
                setStats({
                    users: userData.length,
                    roles: rolesRes.data?.length || 0
                });
                setUsers(
                    userData.map((u) => ({
                        ID: u.perdoruesi?.aspNetUserId,
                        "Emri & Mbiemri": `${u.perdoruesi?.emri ?? ""} ${u.perdoruesi?.mbiemri ?? ""}`.trim(),
                        "Username": `@${u.perdoruesi?.username ?? "—"}`,
                        "Email": u.perdoruesi?.email ?? "—",
                        "Rolet": (u.rolet ?? []).join(", ") || "—",
                    }))
                );
            } catch (err) {
                console.error("Failed to fetch system statistics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);



    if (loading) return (
        <div className="flex justify-center items-center py-20 w-full h-full">
            <TailSpin height="60" width="60" color="#6366f1" />
        </div>
    );

    return (
        <div className="flex flex-col gap-6 animate__animated animate__fadeIn" data-aos="fade-in">

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-5 hover:bg-white/10 transition-colors duration-300">
                    <div className="w-14 h-14 rounded-xl bg-primary/20 text-primary-light flex justify-center items-center text-2xl shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white tracking-tight">{stats.users}</div>
                        <div className="text-text-muted text-sm font-medium mt-0.5 uppercase tracking-wider">Total Users</div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-5 hover:bg-white/10 transition-colors duration-300">
                    <div className="w-14 h-14 rounded-xl bg-accent/20 text-accent-light flex justify-center items-center text-2xl shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                        <FontAwesomeIcon icon={faLayerGroup} />
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white tracking-tight">{stats.roles}</div>
                        <div className="text-text-muted text-sm font-medium mt-0.5 uppercase tracking-wider">Active Roles</div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-5 hover:bg-white/10 transition-colors duration-300">
                    <div className="w-14 h-14 rounded-xl bg-green-500/20 text-green-400 flex justify-center items-center text-2xl shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                        <FontAwesomeIcon icon={faArrowTrendUp} />
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white tracking-tight">100%</div>
                        <div className="text-text-muted text-sm font-medium mt-0.5 uppercase tracking-wider">System Health</div>
                    </div>
                </div>

            </div>

            {/* ── Users Overview Table ── */}
            <CustomTable
                data={users}
                title="User Overview"
                icon={faUserShield}
                mosShfaqID={true}
                itemsPerPage={10}
                exportable={true}
            />

        </div>
    );
};

export default Statistika;
