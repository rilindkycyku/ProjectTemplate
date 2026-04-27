import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

/**
 * RoleGuard - Page-level access control component.
 *
 * Renders nothing visible. On mount, checks if the authenticated user
 * has at least one of the `roletELejuara` roles.
 *
 * - If not logged in → redirects to /login
 * - If logged in but lacks the required role → redirects to /403
 *
 * Usage:
 *   <RoleGuard roletELejuara={["Admin", "Menaxher"]} />
 */
function RoleGuard({ roletELejuara = [] }) {
  const navigate = useNavigate();
  const { token, user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!token || !user) {
      navigate("/login", { replace: true });
      return;
    }

    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    const hasAccess = roletELejuara.some((role) => userRoles.includes(role));

    if (!hasAccess) {
      navigate("/403", { replace: true });
    }
  }, [loading, token, user, roletELejuara, navigate]);

  return null;
}

export default RoleGuard;
