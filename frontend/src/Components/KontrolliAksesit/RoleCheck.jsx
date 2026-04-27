import { useAuth } from "../../Context/AuthContext";

/**
 * RoleCheck - Inline/function-level access control component.
 *
 * Renders its children only if the authenticated user has at least
 * one of the `roletELejuara` roles. Otherwise renders `fallback`
 * (default: null).
 *
 * Usage — hide a button from non-admins:
 *   <RoleCheck roletELejuara={["Admin"]}>
 *     <button>Fshi</button>
 *   </RoleCheck>
 *
 * Usage — render a fallback message:
 *   <RoleCheck roletELejuara={["Admin"]} fallback={<p>Nuk keni akses.</p>}>
 *     <AdminPanel />
 *   </RoleCheck>
 */
function RoleCheck({ roletELejuara = [], children, fallback = null }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return fallback;

  const userRoles = Array.isArray(user.role) ? user.role : [user.role];
  const hasAccess = roletELejuara.some((role) => userRoles.includes(role));

  return hasAccess ? children : fallback;
}

export default RoleCheck;
