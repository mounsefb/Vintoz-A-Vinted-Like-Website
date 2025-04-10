import styled from "@emotion/styled";

export const NavBar = styled("div")({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    
    "@media (max-width: 585px)": {
        flexDirection: "column",
        alignItems: "center",
    },
});


