import React from 'react'
import {useIntl} from 'react-intl'

import Menu from '../widgets/menu'
import {Permission} from '../constants'
import DeleteIcon from '../widgets/icons/delete'
import LinkIcon from '../widgets/icons/Link'
import {Utils} from '../utils'
import CompassIcon from '../widgets/icons/compassIcon'
import {Card} from '../blocks/card'
import TelemetryClient, {TelemetryActions, TelemetryCategory} from '../telemetry/telemetryClient'
import mutator from '../mutator'
import {Board} from '../blocks/board'
import {BoardView} from '../blocks/boardView'
import {useAppSelector} from '../store/hooks'
import {IUser} from '../user'
import {getMe} from '../store/users'

import {sendFlashMessage} from './flashMessages'
import BoardPermissionGate from './permissions/boardPermissionGate'
import {ConfirmationDialogBoxProps} from './confirmationDialogBox'

type Props = {
    board: Board
    activeView: BoardView
    card: Card
    showCard: (cardId?: string) => void
    showConfirmationDialog: (props: ConfirmationDialogBoxProps) => void
    onClose: () => void
}

const CardActionsMenu = (props: Props): JSX.Element => {
    const {board, activeView, card} = props
    const intl = useIntl()
    const me = useAppSelector<IUser|null>(getMe)
    const isTemplate = card.fields.isTemplate

    const makeTemplateClicked = async () => {
        if (!card) {
            Utils.assertFailure('card')
            return
        }

        TelemetryClient.trackEvent(TelemetryCategory, TelemetryActions.AddTemplateFromCard, {board: props.board.id, view: activeView.id, card: card.id})
        await mutator.duplicateCard(
            card.id,
            board.id,
            card.fields.isTemplate,
            intl.formatMessage({id: 'Mutator.new-template-from-card', defaultMessage: 'new template from card'}),
            true,
            async (newCardId) => {
                props.showCard(newCardId)
            },
            async () => {
                props.showCard(undefined)
            },
        )
    }
    const handleDeleteCard = async () => {
        if (!card) {
            Utils.assertFailure()
            return
        }
        TelemetryClient.trackEvent(TelemetryCategory, TelemetryActions.DeleteCard, {board: props.board.id, view: props.activeView.id, card: card.id})
        await mutator.deleteBlock(card, 'delete card')
        props.onClose()
    }

    const handleDeleteButtonOnClick = () => {
        // use may be renaming a card title
        // and accidentally delete the card
        // so adding des
        if (card.title === '' && card.fields.contentOrder.length === 0) {
            handleDeleteCard()
            return
        }

        const dialogBoxProps: ConfirmationDialogBoxProps = {
            heading: intl.formatMessage({id: 'CardDialog.delete-confirmation-dialog-heading', defaultMessage: 'Confirm card delete!'}),
            confirmButtonText: intl.formatMessage({id: 'CardDialog.delete-confirmation-dialog-button-text', defaultMessage: 'Delete'}),
            onConfirm: handleDeleteCard,
            onClose: () => {},
        }
        props.showConfirmationDialog(dialogBoxProps)
    }


    return (
        <>
            <Menu position="left">
                <BoardPermissionGate permissions={[Permission.ManageBoardCards]}>
                    <Menu.Text
                        id="delete"
                        icon={<DeleteIcon/>}
                        name="Delete"
                        onClick={handleDeleteButtonOnClick}
                    />
                </BoardPermissionGate>
                {me?.id !== 'single-user' &&
                <Menu.Text
                    icon={<LinkIcon/>}
                    id="copy"
                    name={intl.formatMessage({id: 'CardDialog.copyLink', defaultMessage: 'Copy link'})}
                    onClick={() => {
                        let cardLink = window.location.href

                        if (!cardLink.includes(card.id)) {
                            cardLink += `/${card.id}`
                        }

                        Utils.copyTextToClipboard(cardLink)
                        sendFlashMessage({
                            content: intl.formatMessage({
                                id: 'CardDialog.copiedLink',
                                defaultMessage: 'Copied!'
                            }), severity: 'high'
                        })
                    }}
                />
                }
                {!isTemplate &&
                <BoardPermissionGate permissions={[Permission.ManageBoardProperties]}>
                    <Menu.Text
                        id="makeTemplate"
                        icon={
                            <CompassIcon
                                icon="plus"
                            />}
                        name="New template from card"
                        onClick={makeTemplateClicked}
                    />
                </BoardPermissionGate>
                }
            </Menu>
        </>
    )
}

export default CardActionsMenu
