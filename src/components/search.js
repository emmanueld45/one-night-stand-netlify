import React from "react";
import Header, {MobileHeader} from "./header";
import MobileNav from "./mobile-nav";
import UsersCard from "./users-card";

function Search() {
  return (
    <>
      <Header />
      <MobileHeader />
      <div className="Search">
        <div className="content">
          <UsersCard />
        </div>
      </div>
      <MobileNav />
    </>
  );
}

export default Search;
