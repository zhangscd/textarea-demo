import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppEditorService {

    constructor() { }

    /**
     * regarding to current caret offset, return name between @ to end or space
     * @param content
     * @param offset
     */
    getCurrentProfileName(content: string = "", offset: number) {
        let ret: { followAt: boolean, name: string } = { followAt: false, name: "" };

        const preSubstr = content.substr(0, offset); // Content before caret
        const atIndex = preSubstr.lastIndexOf('@');

        if (atIndex > -1) {
            const preSpaceIndex = preSubstr.lastIndexOf(" ");
            if (preSpaceIndex < atIndex) {
                const followSpaceIndex = content.indexOf(" ", offset - 1);
                // get current profile name between @ -> end or space
                ret.followAt = true;
                ret.name = content.substring(atIndex + 1, followSpaceIndex > atIndex ? followSpaceIndex : content.length);
            }
        }

        return ret;
    }

    /**
     * return profile list
     * @param content
     * @param offset
     */
    getProfileList(content: string = "", offset: number) {
        let list: Profile[] = [];

        let profileNameResult = this.getCurrentProfileName(content, offset);
        if (profileNameResult.followAt && !this._checkExistProfileByName(profileNameResult.name)) {
            list = this._getProfileListByName(profileNameResult.name);
        }

        return list;
    }

    private _getProfileListByName(profileNameInput: string): Profile[] {
        return PROFILE_LIST.filter(profile => profile.name.toLowerCase().startsWith(profileNameInput? profileNameInput.toLowerCase(): ""));
    }

    private _checkExistProfileByName(profileName: string): boolean {
        return profileName ? !!PROFILE_LIST.find(profile => profile.name.toLowerCase() === profileName.toLowerCase()) : false;
    }
}

export interface Profile {
    id: number;
    name: string;
    addr: string;
}

const PROFILE_LIST: Profile[] = [
    { id: 1, name: "Abigail", addr: "Ajax" },
    { id: 2, name: "Addison", addr: "Aurora" },
    { id: 3, name: "Aiden", addr: "Brampton" },
    { id: 4, name: "Alexander", addr: "Brock" },
    { id: 5, name: "Amelia", addr: "Burlington" },
    { id: 6, name: "Andrew", addr: "Caledon" },
    { id: 7, name: "Anthony", addr: "Clarington" },
    { id: 8, name: "Aria", addr: "East Gwillimbury" },
    { id: 9, name: "Asher", addr: "Georgina" },
    { id: 10, name: "Aubrey", addr: "Halton Hills" },
    { id: 11, name: "Audrey", addr: "King" },
    { id: 12, name: "Aurora", addr: "Markham" },
    { id: 13, name: "Ava", addr: "Milton" },
    { id: 14, name: "Avery", addr: "Mississauga" },
    { id: 15, name: "Bella", addr: "Newmarket" },
    { id: 16, name: "Benjamin", addr: "Oakville" },
    { id: 17, name: "Brooklyn", addr: "Oshawa" },
    { id: 18, name: "Caleb", addr: "Pickering" },
    { id: 19, name: "Camila", addr: "Richmond Hill" },
    { id: 20, name: "Carter", addr: "Scugog" },
    { id: 21, name: "Charlotte", addr: "Toronto" },
    { id: 22, name: "Chloe", addr: "Uxbridge" },
    { id: 23, name: "Christopher", addr: "Vaughan" },
    { id: 24, name: "Claire", addr: "Whitby" },
    { id: 25, name: "Daniel", addr: "Whitchurch-Stouffville" },
    { id: 26, name: "David", addr: "Ajax" },
    { id: 27, name: "Dylan", addr: "Aurora" },
    { id: 28, name: "Eleanor", addr: "Brampton" },
    { id: 29, name: "Elijah", addr: "Brock" },
    { id: 30, name: "Elizabeth", addr: "Burlington" },
    { id: 31, name: "Ella", addr: "Caledon" },
    { id: 32, name: "Ellie", addr: "Clarington" },
    { id: 33, name: "Emily", addr: "East Gwillimbury" },
    { id: 34, name: "Emma", addr: "Georgina" },
    { id: 35, name: "Ethan", addr: "Halton Hills" },
    { id: 36, name: "Evelyn", addr: "King" },
    { id: 37, name: "Gabriel", addr: "Markham" },
    { id: 38, name: "Grace", addr: "Milton" },
    { id: 39, name: "Grayson", addr: "Mississauga" },
    { id: 40, name: "Hannah", addr: "Newmarket" },
    { id: 41, name: "Harper", addr: "Oakville" },
    { id: 42, name: "Hazel", addr: "Oshawa" },
    { id: 43, name: "Henry", addr: "Pickering" },
    { id: 44, name: "Isaac", addr: "Richmond Hill" },
    { id: 45, name: "Isabella", addr: "Scugog" },
    { id: 46, name: "Jack", addr: "Toronto" },
    { id: 47, name: "Jackson", addr: "Uxbridge" },
    { id: 48, name: "Jacob", addr: "Vaughan" },
    { id: 49, name: "James", addr: "Whitby" },
    { id: 50, name: "Jaxon", addr: "Whitchurch-Stouffville" },
    { id: 51, name: "Jayden", addr: "Ajax" },
    { id: 52, name: "John", addr: "Aurora" },
    { id: 53, name: "Joseph", addr: "Brampton" },
    { id: 54, name: "Joshua", addr: "Brock" },
    { id: 55, name: "Julian", addr: "Burlington" },
    { id: 56, name: "Layla", addr: "Caledon" },
    { id: 57, name: "Leah", addr: "Clarington" },
    { id: 58, name: "Leo", addr: "East Gwillimbury" },
    { id: 59, name: "Levi", addr: "Georgina" },
    { id: 60, name: "Liam", addr: "Halton Hills" },
    { id: 61, name: "Lillian", addr: "King" },
    { id: 62, name: "Lily", addr: "Markham" },
    { id: 63, name: "Lincoln", addr: "Milton" },
    { id: 64, name: "Logan", addr: "Mississauga" },
    { id: 65, name: "Lucas", addr: "Newmarket" },
    { id: 66, name: "Luke", addr: "Oakville" },
    { id: 67, name: "Luna", addr: "Oshawa" },
    { id: 68, name: "Madison", addr: "Pickering" },
    { id: 69, name: "Mason", addr: "Richmond Hill" },
    { id: 70, name: "Mateo", addr: "Scugog" },
    { id: 71, name: "Matthew", addr: "Toronto" },
    { id: 72, name: "Mia", addr: "Uxbridge" },
    { id: 73, name: "Michael", addr: "Vaughan" },
    { id: 74, name: "Mila", addr: "Whitby" },
    { id: 75, name: "Natalie", addr: "Whitchurch-Stouffville" },
    { id: 76, name: "Nathan", addr: "Ajax" },
    { id: 77, name: "Noah", addr: "Aurora" },
    { id: 78, name: "Nora", addr: "Brampton" },
    { id: 79, name: "Oliver", addr: "Brock" },
    { id: 80, name: "Olivia", addr: "Burlington" },
    { id: 81, name: "Owen", addr: "Caledon" },
    { id: 82, name: "Penelope", addr: "Clarington" },
    { id: 83, name: "Riley", addr: "East Gwillimbury" },
    { id: 84, name: "Ryan", addr: "Georgina" },
    { id: 85, name: "Samuel", addr: "Halton Hills" },
    { id: 86, name: "Savannah", addr: "King" },
    { id: 87, name: "Scarlett", addr: "Markham" },
    { id: 88, name: "Sebastian", addr: "Milton" },
    { id: 89, name: "Skylar", addr: "Mississauga" },
    { id: 90, name: "Sofia", addr: "Newmarket" },
    { id: 91, name: "Sophia", addr: "Oakville" },
    { id: 92, name: "Stella", addr: "Oshawa" },
    { id: 93, name: "Theodore", addr: "Pickering" },
    { id: 94, name: "Thomas", addr: "Richmond Hill" },
    { id: 95, name: "Victoria", addr: "Scugog" },
    { id: 96, name: "Violet", addr: "Toronto" },
    { id: 97, name: "William", addr: "Uxbridge" },
    { id: 98, name: "Wyatt", addr: "Vaughan" },
    { id: 99, name: "Zoe", addr: "Whitby" },
    { id: 100, name: "Zoey", addr: "Whitchurch-Stouffville" },
]
