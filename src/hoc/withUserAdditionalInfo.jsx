const withUserAdditionalInfo = (Component, user) => () => {
    return (
        <div>
            <img src={user.image} alt="profile photo" />
            <div className="mb-20">
                <Component user={user} />
                <p>Gender: {user.gender}</p>
                <p>Birth Date: {user.birthDate}</p>
                <p>Blood Group: {user.bloodGroup}</p>
            </div>
            <div className="mb-20">
                <h4 className="">Company Details</h4>
                <p>Name: {user.company?.name}</p>
                <p >Title: {user.company?.title}</p>
            </div>
            <div className="mb-20">
                <h4>Bank Details</h4>
                <p>IBAN: {user.bank?.iban}</p>
                <p>Card Number: {user.bank?.cardNumber}</p>
                <p>Card Type: {user.bank?.cardType}</p>
            </div>
        </div>
    )
}

export default withUserAdditionalInfo;