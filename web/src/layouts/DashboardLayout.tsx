import { useEffect } from "react";
import { Outlet, useLocation, useNavigate, useRoutes } from "react-router-dom";
import { AuthService } from "../services/AuthService";
import { MdDomain, MdDirectionsRun } from "react-icons/md";

const LINKS = [
  { title: "Domains", path: "/dashboard/domains", icon: <MdDomain /> },
  { title: "Tasks", path: "/dashboard/tasks", icon: <MdDirectionsRun /> },
];

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const loginStatus = await AuthService.getLoginStatus();
      if (!loginStatus) {
        navigate("/login");
      }
    })();
  }, []);

  return (
    <div className="flex">
      <div style={{ width: "200px" }} className="pt-8 px-4">
        <div className="flex flex-col gap-4 sticky top-8">
          {LINKS.map((link) => (
            <div
              key={link.title}
              className={`px-4 py-2 bg-white/5 hover:bg-white/20 cursor-pointer flex flex-col gap-2 border-r-4 hover:border-white ${
                location.pathname.match(link.path)
                  ? "bg-white/20 border-white"
                  : ""
              }`}
              onClick={() => navigate(link.path)}
            >
              <div>{link.icon}</div>
              <div className="text-sm">{link.title}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 py-8 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
