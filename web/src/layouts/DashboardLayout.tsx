import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";

const LINKS = [
  { title: "Domains", path: "/dashboard/domains" },
  { title: "Emails", path: "/dashboard/emails" },
];

export function DashboardLayout() {
  const navigate = useNavigate();

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
              className="px-4 py-2 bg-white/5 text-sm hover:bg-white/20 cursor-pointer"
              onClick={() => navigate(link.path)}
            >
              {link.title}
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
