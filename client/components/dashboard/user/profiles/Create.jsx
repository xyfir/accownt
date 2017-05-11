import React from "react";

// Components
import Profile from "./Profile";

// Modules
import request from "lib/request";
import parseQuery from "lib/url/parse-hash-query";

export default class CreateProfile extends React.Component {
	
	constructor(props) {
		super(props);
	}
	
	onCreateProfile(e) {
        e.preventDefault();
        
		const data = {
			name: this.refs.name.value,
			email: this.refs.email.value,
			fname: this.refs.fname.value,
			lname: this.refs.lname.value,
			gender: this.refs.gender.value,
			phone: this.refs.phone.value,
			birthdate: this.refs.birthdate.value,
			address: this.refs.address.value,
			zip: this.refs.zip.value,
			region: this.refs.region.value,
			country: this.refs.country.value
		};
		
		request({
			url: "../api/dashboard/user/profiles",
			method: "POST", data,
			success: (result) => {
				if (result.error) {
					swal("Error", result.message, "error");
				}
				else {
                    const q = parseQuery();

                    location.hash = q.rdr || "#/dashboard/user/profiles";  
					swal("Success", result.message, "success");
				}
			}
		});
	}
	
	render() {
		return (
            <form
                className="profile-create old"
                onSubmit={(e) => this.onCreateProfile(e)}
            >
                <section className="info">
                    <p>All fields other than profile name are optional.</p>
                </section>

                <section className="form">
                    <label>Profile Name</label>
                    <input type="text" ref="name" />
                    
                    <label>Email</label>
                    <input type="email" ref="email" />
                    
                    <br />

                    <label>First Name</label>
                    <input type="text" ref="fname" />
                    
                    <label>Last Name</label>
                    <input type="text" placeholder="Last Name" ref="lname" />
                    
                    <label>Gender</label>
                    <select ref="gender">
                        <option value="0">-</option>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                        <option value="3">Other</option>
                    </select>

                    <label>Phone #</label>
                    <input type="tel" ref="phone" />
                    
                    <label>Birthdate</label>
                    <input type="date" ref="birthdate" />
                    
                    <br />
                    
                    <label>Address</label>
                    <input type="text" ref="address" />
                    
                    <label>Zip Code</label>
                    <input type="number" ref="zip" />
                    
                    <label>State/Province/Region Code</label>
                    <input type="text" ref="region" />
                    
                    <label>Country Code</label>
                    <input type="text" ref="country" />
                </section>

                <section className="controls">
                    <button className="btn-primary">Create Profile</button>
                </section>
            </form>
		);
	}
	
}