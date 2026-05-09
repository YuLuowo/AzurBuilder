export type Ship = {
    key: string,
    name: string,
    painting: string,
    nationality: number,
    rarity: number,
    type: number,
    tag_list: string[],
    group_type: number,
    trans: boolean,
    ship_equip: number[][],
}

export type SkillDetails = {
    id: number,
    desc: string,
    icon: number,
    name: string,
}

export type TransSkillDetails = {
    id: number,
    desc: string,
    icon: number,
    name: string,
}

export type ShipSkill = {
    key: string,
    group_type: number,
    skills: SkillDetails[],
    trans_skills: TransSkillDetails[],
    shipName: string,
}

export type TransformDetails = {
    id: number,
    name: string,
    descrip: string,
    use_gold: number,
    use_item: number[][],
    use_ship: number,
    max_level: number,
    star_limit: number,
    level_limit: number,
}

export type ShipTransform = {
    key: string,
    transform: TransformDetails,
    shipName: string,
}