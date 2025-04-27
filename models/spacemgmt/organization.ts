export default interface Organization {
    orgId: number
    orgGuid: string
    orgName: string
    industry: number
    buildingName: string
    mailingAddress: string
    country: number
    state: number
    city: number
    zipcode: string
    phoneNumber: string
    email: string
    website: string
    image: string
    logo: string
    roles: any
    countryId: number | null
    countryName: string | null
    stateId: number | null
    stateName: string | null
    cityId: number | null
    cityName: string | null
}

