import React from "react"
import Header from "./Header";

class Layout extends React.Component {
    render() {
        return (
            <>
                <Header />
                <main className="mb-12">{this.props.children}</main>
            </>
        )
    }
}
export default Layout;
