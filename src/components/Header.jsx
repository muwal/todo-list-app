import React, { Component } from "react";

class Header extends Component {
    render() {
        return (
            <>
                <div className="text-3xl text-white font-bold bg-cyan flex items-center h-[105px]" data-cy="header-background">
                    <div className="container mx-auto" data-cy="header-title">
                        TO DO LIST APP
                    </div>
                </div>
            </>
        );
    }
}

export default Header