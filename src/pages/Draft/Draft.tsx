import { AdjustmentsIcon, ClockIcon, RefreshIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { getLinkStyles } from '../../components/Link/Link';
import { toast } from '../../components/Toast/Toast';
import { SettingsState, Team, useSettings } from '../../contexts/SettingsContext/SettingsContext';
import { PlayerData } from '../../hooks/usePlayerData/usePlayerData';
import DraftList from './components/DraftList/DraftList';
import PlayersTable from './components/PlayersTable/PlayersTable';
import ResetModal from './components/ResetModal/ResetModal';

export interface DraftPick {
    pickNumber: number;
    playerSelected: PlayerData | null;
    team: Team;
}

const createDraftOrder = (settings: SettingsState) => {
    const rounds = settings.roster.bench
        + settings.roster.center
        + settings.roster.defense
        + settings.roster.goalie
        + settings.roster.leftWing
        + settings.roster.rightWing;

    const teamsByDraftPosition = [...settings.teams].sort((a, b) => a.draftPosition - b.draftPosition);
    const picks: DraftPick[] = [];

    let pickNumber = 1;

    for (let i = 0; i < rounds; i++) {
        for (const team of teamsByDraftPosition) {
            picks.push({
                pickNumber: pickNumber++,
                playerSelected: null,
                team,
            });
        }

        teamsByDraftPosition.reverse();
    }

    return picks;
};

const Draft = (): JSX.Element => {
    const [settings] = useSettings();

    const [currentPickNumber, setCurrentPickNumber] = React.useState(1);
    const [draftPicks, setDraftPicks] = React.useState(createDraftOrder(settings));
    const [draftStarted, setDraftStarted] = React.useState(false);
    const [showResetModal, setShowResetModal] = React.useState(false);

    const draftedPlayers = React.useMemo(() => {
        return draftPicks
            .filter((dp) => dp.playerSelected !== null)
            .map((dp) => dp.playerSelected) as PlayerData[];
    }, [draftPicks]);

    const handleCloseResetModal = (resetConfirmed: boolean) => {
        if (resetConfirmed) {
            setDraftStarted(false);
            setCurrentPickNumber(1);
            setDraftPicks(createDraftOrder(settings));

            toast.success('Draft reset');
        }

        setShowResetModal(false);
    };

    const handleDraftPlayer = (player: PlayerData) => {
        const draftPicksCopy = [...draftPicks];

        draftPicksCopy[currentPickNumber - 1].playerSelected = player;

        setDraftPicks(draftPicksCopy);
        setCurrentPickNumber(currentPickNumber + 1);
    };

    return (
        <>
            <div className="grid grid-cols-12 gap-x-5 md:gap-x-8 gap-y-6 sm:px-5 md:px-8 py-6">
                <div className="col-span-8 order-2">
                    <div className="mb-6">
                        <h1 className="mb-2 text-2xl font-medium text-gray-800">
                            Draft
                        </h1>
                        <div className="flex items-center space-x-6">
                            {!draftStarted ? (
                                <>
                                    <Button
                                        icon={<ClockIcon />}
                                        link
                                        onClick={() => setDraftStarted(true)}
                                    >
                                        Start the draft
                                    </Button>
                                    <Link
                                        to="/customize"
                                        className={`flex items-center ${getLinkStyles(true)} text-sm font-medium`}
                                    >
                                        <AdjustmentsIcon className="h-4 w-4 -ml-px mr-1.5" />
                                        Customize
                                    </Link>
                                </>
                            ) : (
                                <Button
                                    icon={<RefreshIcon />}
                                    link
                                    onClick={() => setShowResetModal(true)}
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>
                    <section>
                        <PlayersTable
                            canDraftPlayers={draftStarted && currentPickNumber < draftPicks.length}
                            draftedPlayers={draftedPlayers}
                            onDraftPlayer={handleDraftPlayer}
                        />
                    </section>
                </div>
                <section className="col-span-2 order-1">
                    <DraftList
                        currentPickNumber={currentPickNumber}
                        draftStarted={draftStarted}
                        numberOfTeams={settings.teams.length}
                        picks={draftPicks}
                    />
                </section>
                <section className="col-span-2 order-3">
                </section>
            </div>
            {draftStarted ? (
                <ResetModal
                    onClose={handleCloseResetModal}
                    open={showResetModal}
                />
            ) : null}
        </>
    );
};

export default Draft;