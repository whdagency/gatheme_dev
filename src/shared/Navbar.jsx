import React from "react";
import { ShoppingBag, Star, MessageCircle, User, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";

const Navbar = ({ hideCallToActionBtn }) => {
  const { restoSlug, table_id } = useMenu();

  const navLinks = [
    {
      label: "Home",
      href: `/menu/${restoSlug}?table_id=${table_id}`,
      icon: ShoppingBag,
      name: "home",
    },
    {
      label: "My Cart",
      href: `/menu/${restoSlug}/cart?table_id=${table_id}`,
      icon: Star,
      name: "cart",
    },
    {
      label: "Feedback",
      href: `/menu/${restoSlug}/feedback?table_id=${table_id}`,
      icon: MessageCircle,
      name: "feedback",
    },
    {
      label: "Profile",
      href: `/menu/${restoSlug}/info?table_id=${table_id}`,
      icon: User,
      name: "profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0">
      {/* Navigation */}
      <div className="md:pb-7 fixed bottom-0 left-0 right-0 flex items-center justify-between max-w-md px-4 py-3 mx-auto bg-white border-t">
        {navLinks.map((link) => (
          <NavItem key={link.label} {...link} />
        ))}

        {/* Call to Action Button as part of the navigation */}
        {!hideCallToActionBtn && (
          <button
            className="flex absolute -top-16 right-5 items-center justify-center p-4 rounded-full shadow-lg w-[52px] h-[52px]"
            style={{ background: "#F86A2E" }}
          >
            <Plus className="text-white" size={30} />
          </button>
        )}

        {/* Border bottom */}
        <div
          className="absolute hidden md:block md:bottom-3 -translate-x-1/2 left-1/2 right-0 rounded-[104.8px] border-b-4 border-[#191D31]"
          style={{ width: "141.48px" }}
        />
      </div>
    </div>
  );
};

export default Navbar;

const NavItem = ({ href, label, ...rest }) => {
  const name = rest.name;
  const getCorrectIcon = (isActive) => {
    switch (name) {
      case "home":
        return isActive ? <HomeActiveIcon /> : <HomeInactiveIcon />;
      case "cart":
        return isActive ? <CartActiveIcon /> : <CartInactiveIcon />;
      case "feedback":
        return isActive ? <FeedbackActiveIcon /> : <FeedbackInactiveIcon />;
      case "profile":
        return isActive ? <InfoActiveIcon /> : <InfoInactiveIcon />;
      default:
        break;
    }
  };

  return (
    <NavLink to={href} className="flex flex-col items-center">
      {({ isActive }) => (
        <>
          {getCorrectIcon(isActive)}
          <span
            className={`text-xs mt-2`}
            style={{
              color: isActive ? "#F86A2E" : "#A7AEC1",
            }}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
};

const HomeInactiveIcon = ({ fill = "#A7AEC1" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
    >
      <path
        d="M12.7118 19.2179V16.0739"
        stroke="#A7AEC1"
        strokeWidth="1.572"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6894 3.31323L3.4268 9.12963C2.60936 9.77939 2.08536 11.1523 2.26352 12.1793L3.65736 20.5214C3.90888 22.0096 5.33416 23.2148 6.84328 23.2148H18.5809C20.0795 23.2148 21.5153 21.9991 21.7668 20.5214L23.1606 12.1793C23.3283 11.1523 22.8043 9.77939 21.9974 9.12963L14.7347 3.32371C13.6134 2.42243 11.8003 2.42243 10.6894 3.31323Z"
        stroke={fill}
        strokeWidth="1.572"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const HomeActiveIcon = ({ fill = "#F86A2E" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
    >
      <path
        d="M22.4656 8.74062L15.6012 3.2491C14.2597 2.18014 12.1637 2.16966 10.8328 3.23862L3.96839 8.74062C2.98327 9.52662 2.38591 11.0986 2.59551 12.3353L3.91599 20.2372C4.21991 22.0083 5.86527 23.4021 7.65735 23.4021H18.7661C20.5373 23.4021 22.2141 21.9769 22.518 20.2267L23.8385 12.3248C24.0271 11.0986 23.4298 9.52662 22.4656 8.74062ZM13.9978 19.2101C13.9978 19.6398 13.6414 19.9961 13.2118 19.9961C12.7821 19.9961 12.4257 19.6398 12.4257 19.2101V16.0661C12.4257 15.6365 12.7821 15.2801 13.2118 15.2801C13.6414 15.2801 13.9978 15.6365 13.9978 16.0661V19.2101Z"
        fill={fill}
      />
    </svg>
  );
};

const CartInactiveIcon = ({ fill = "#A7AEC1" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
    >
      <path
        d="M9.61492 7.15812H17.1605C20.7237 7.15812 21.0801 8.82444 21.3211 10.8576L22.2643 18.7176C22.5682 21.2956 21.7717 23.4021 18.1037 23.4021H8.6822C5.00372 23.4021 4.20724 21.2956 4.52164 18.7176L5.46485 10.8576C5.69541 8.82444 6.05172 7.15812 9.61492 7.15812Z"
        stroke={fill || "#A7AEC1"}
        strokeWidth="1.572"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.1958 8.73012V5.06212C9.1958 3.49012 10.2438 2.44212 11.8158 2.44212H14.9598C16.5318 2.44212 17.5798 3.49012 17.5798 5.06212V8.73012"
        stroke={fill || "#A7AEC1"}
        strokeWidth="1.572"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.2015 18.1949H9.1958"
        stroke={fill || "#A7AEC1"}
        strokeWidth="1.572"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const CartActiveIcon = ({ fill = "#F86A2E" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
    >
      <path
        d="M17.0798 9.52394C16.6501 9.52394 16.2938 9.16762 16.2938 8.73794V5.06994C16.2938 3.9381 15.5916 3.23594 14.4598 3.23594H11.3158C10.1839 3.23594 9.48179 3.9381 9.48179 5.06994V8.73794C9.48179 9.16762 9.12547 9.52394 8.69579 9.52394C8.26611 9.52394 7.90979 9.16762 7.90979 8.73794V5.06994C7.90979 3.06826 9.31411 1.66394 11.3158 1.66394H14.4598C16.4615 1.66394 17.8658 3.06826 17.8658 5.06994V8.73794C17.8658 9.16762 17.5095 9.52394 17.0798 9.52394Z"
        fill={fill || "#F86A2E"}
      />
      <path
        d="M8.69565 18.9874C8.26597 18.9874 7.90965 18.6311 7.90965 18.2014C7.90965 17.7612 8.26597 17.4154 8.69565 17.4154H21.0201C21.3345 17.4154 21.5756 17.1429 21.5441 16.8285L20.8315 10.8654C20.58 8.83226 20.2236 7.16594 16.6604 7.16594H9.11485C5.55165 7.16594 5.19533 8.83226 4.95429 10.8654L4.01109 18.7254C3.70717 21.3035 4.50365 23.4099 8.18213 23.4099H17.5932C20.9048 23.4099 21.8795 21.7017 21.8271 19.4799C21.8166 19.197 21.586 18.9874 21.3031 18.9874H8.69565Z"
        fill={fill || "#F86A2E"}
      />
    </svg>
  );
};

const FeedbackActiveIcon = ({ fill = "#F86A2E" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
    >
      <g clipPath="url(#clip0_1970_1384)">
        <path
          d="M21.9183 8.63135C21.7279 8.08204 21.2391 7.67985 20.6506 7.59254L14.9265 6.74141L12.4384 1.57554C12.1765 1.0331 11.6162 0.685913 11.0002 0.685913C10.3842 0.685913 9.82384 1.0331 9.56191 1.57554L7.07384 6.74141L1.34903 7.59254C0.76122 7.67985 0.272407 8.08204 0.0826574 8.63135C-0.106405 9.18204 0.0365949 9.78841 0.451845 10.2023L4.64697 14.3905L3.67416 20.2006C3.57516 20.7857 3.82885 21.3728 4.32591 21.7152C4.59885 21.9028 4.91991 21.9984 5.24097 21.9984C5.50497 21.9984 5.76966 21.9338 6.00959 21.8052L11.0002 19.1185L15.9914 21.8052C16.2313 21.9338 16.496 21.9984 16.7593 21.9984C17.0804 21.9984 17.4015 21.9028 17.6751 21.7152C18.1722 21.3728 18.4245 20.7857 18.3262 20.2006L17.3527 14.3905L21.5492 10.2023C21.9637 9.78773 22.106 9.18135 21.9183 8.63135Z"
          fill={fill || "#F86A2E"}
        />
      </g>
      <defs>
        <clipPath id="clip0_1970_1384">
          <rect
            width="22"
            height="22"
            fill="white"
            transform="translate(0.000488281 -0.00158691)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

const FeedbackInactiveIcon = ({ fill = "#A6ADB4" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="22"
      viewBox="0 0 23 22"
      fill="none"
    >
      <g clipPath="url(#clip0_1970_239)">
        <path
          d="M22.4183 8.63135C22.2279 8.08204 21.7391 7.67985 21.1506 7.59254L15.4265 6.74141L12.9384 1.57554C12.6765 1.0331 12.1162 0.685913 11.5002 0.685913C10.8842 0.685913 10.3238 1.0331 10.0619 1.57554L7.57384 6.74141L1.84903 7.59254C1.26122 7.67985 0.772407 8.08204 0.582657 8.63135C0.393595 9.18204 0.536595 9.78841 0.951845 10.2023L5.14697 14.3905L4.17416 20.2006C4.07516 20.7857 4.32885 21.3728 4.82591 21.7152C5.09885 21.9028 5.41991 21.9984 5.74097 21.9984C6.00497 21.9984 6.26966 21.9338 6.5096 21.8052L11.5002 19.1185L16.4914 21.8052C16.7313 21.9338 16.996 21.9984 17.2593 21.9984C17.5804 21.9984 17.9015 21.9028 18.1751 21.7152C18.6722 21.3728 18.9245 20.7857 18.8262 20.2006L17.8527 14.3905L22.0492 10.2023C22.4637 9.78773 22.606 9.18135 22.4183 8.63135ZM16.7169 13.3105C16.3649 13.6611 16.2054 14.1554 16.2858 14.6401L17.2593 20.4502L12.2681 17.7648C12.0288 17.6355 11.7648 17.5716 11.4995 17.5716C11.2355 17.5716 10.9708 17.6362 10.7315 17.7648L5.74028 20.4502L6.71378 14.6401C6.79491 14.1554 6.63541 13.6611 6.28341 13.3105L2.08828 9.12223L7.81241 8.26973C8.3356 8.19204 8.78591 7.86479 9.01072 7.39798L11.5002 2.23348L13.9889 7.39866C14.2144 7.86548 14.664 8.19204 15.1865 8.27041L20.912 9.12291L16.7169 13.3105Z"
          fill={fill || "#A7AEC1"}
        />
      </g>
      <defs>
        <clipPath id="clip0_1970_239">
          <rect
            width="22"
            height="22"
            fill="white"
            transform="translate(0.500488 -0.00158691)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

const InfoActiveIcon = ({ fill = "#F86A2E" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
    >
      <path
        d="M13.2398 12.9298C16.1338 12.9298 18.4798 10.5838 18.4798 7.68983C18.4798 4.79586 16.1338 2.44983 13.2398 2.44983C10.3458 2.44983 7.99982 4.79586 7.99982 7.68983C7.99982 10.5838 10.3458 12.9298 13.2398 12.9298Z"
        fill={fill || "#F86A2E"}
      />
      <path
        d="M13.24 15.5499C7.98949 15.5499 3.71365 19.0712 3.71365 23.4099C3.71365 23.7034 3.94421 23.9339 4.23765 23.9339H22.2423C22.5357 23.9339 22.7663 23.7034 22.7663 23.4099C22.7663 19.0712 18.4905 15.5499 13.24 15.5499Z"
        fill={fill || "#F86A2E"}
      />
    </svg>
  );
};

const InfoInactiveIcon = ({ fill = "#A6ADB4" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
    >
      <path
        d="M12.7398 12.9298C15.6338 12.9298 17.9798 10.5838 17.9798 7.68983C17.9798 4.79586 15.6338 2.44983 12.7398 2.44983C9.84581 2.44983 7.49979 4.79586 7.49979 7.68983C7.49979 10.5838 9.84581 12.9298 12.7398 12.9298Z"
        stroke={fill || "#A7AEC1"}
        strokeWidth="1.572"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.7423 23.4099C21.7423 19.3541 17.7075 16.0739 12.7399 16.0739C7.77243 16.0739 3.73763 19.3541 3.73763 23.4099"
        stroke={fill || "#A7AEC1"}
        strokeWidth="1.572"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
