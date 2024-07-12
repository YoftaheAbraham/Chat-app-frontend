import { useEffect } from "react"

const GroupDisplay = ({ dataRedux, toMessageGroup, group }) => {
    return (
        <>
            {group && <>
                <button className="w-full" onClick={() => { toMessageGroup(group.groupID, group) }}>
                    <li className={`flex items-center justify-between mb-2 p-2 rounded-md border border-slate-500 cursor-pointer ${dataRedux.chattingUser && dataRedux.chattingUser.userID == group.userID ? 'bg-slate-700' : 'bg-slate-900'} hover:bg-slate-700`}>
                        <div className="flex items-center justify-between flex-1">
                            <div className="left flex items-center justify-center">
                                <div className="flex flex-col">
                                    <div className="relative">
                                        <img
                                            src={group.
                                                groupProfilePicture}
                                            alt=""
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-semibold">{group.groupName}</h5>
                                    <p className="text-sm text-cyan-600 text-start">{group.groupUsername}</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600">{group.members.length}</p>
                        </div>
                    </li>
                </button>
            </>
            }
        </>


    )
}

export default GroupDisplay
