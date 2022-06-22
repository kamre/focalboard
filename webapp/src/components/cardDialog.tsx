// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {useCallback, useState} from 'react'
import {useIntl} from 'react-intl'
import {useHistory} from 'react-router-dom'

import {Board} from '../blocks/board'
import {BoardView} from '../blocks/boardView'
import {Card} from '../blocks/card'
import mutator from '../mutator'
import {getCard} from '../store/cards'
import {getCardComments} from '../store/comments'
import {getCardContents} from '../store/contents'
import {useAppSelector} from '../store/hooks'
import {Utils} from '../utils'
import ArrowExpand from '../widgets/icons/arrowExpand'
import IconButton from '../widgets/buttons/iconButton'
import Button from '../widgets/buttons/button'
import {getUserBlockSubscriptionList} from '../store/initialLoad'
import {IUser} from '../user'
import {getMe} from '../store/users'

import Dialog from './dialog'
import CardContent from './cardContent'
import CardActionsMenu from './cardActionsMenu'

import './cardDialog.scss'
import ConfirmationDialogBox, {ConfirmationDialogBoxProps} from './confirmationDialogBox'

type Props = {
    board: Board
    activeView: BoardView
    views: BoardView[]
    cards: Card[]
    cardId: string
    onClose: () => void
    showCard: (cardId?: string) => void
    readonly: boolean
}

const CardDialog = (props: Props): JSX.Element => {
    const {board, activeView, cards, views} = props
    const card = useAppSelector(getCard(props.cardId))
    const contents = useAppSelector(getCardContents(props.cardId))
    const comments = useAppSelector(getCardComments(props.cardId))
    const intl = useIntl()
    const history = useHistory()
    const me = useAppSelector<IUser|null>(getMe)
    const isTemplate = card && card.fields.isTemplate
    const [confirmationDialogVisible, setConfirmationDialogVisible] = useState(false)
    const [confirmationDialogProps, setConfirmationDialogProps] = useState<ConfirmationDialogBoxProps>()

    const followActionButton = (following: boolean): React.ReactNode => {
        const followBtn = (
            <Button
                className='cardFollowBtn follow'
                size='medium'
                onClick={() => mutator.followBlock(props.cardId, 'card', me!.id)}
            >
                {intl.formatMessage({id: 'CardDetail.Follow', defaultMessage: 'Follow'})}
            </Button>
        )

        const unfollowBtn = (
            <Button
                className='cardFollowBtn unfollow'
                onClick={() => mutator.unfollowBlock(props.cardId, 'card', me!.id)}
            >
                {intl.formatMessage({id: 'CardDetail.Following', defaultMessage: 'Following'})}
            </Button>
        )

        return following ? unfollowBtn : followBtn
    }

    const onExpand = useCallback(() => {
        const newLocation = {
            ...history.location,
            search: '?fullscreen'
        }
        history.push(newLocation)
    }, [history])

    const followingCards = useAppSelector(getUserBlockSubscriptionList)
    const isFollowingCard = Boolean(followingCards.find((following) => following.blockId === props.cardId))
    const followButton = followActionButton(isFollowingCard)
    const toolbar = (
        <>
            {!isTemplate && Utils.isFocalboardPlugin() && followButton}
            <IconButton
                icon={<ArrowExpand/>}
                size='medium'
                onClick={onExpand}
            />
        </>
    )

    const showConfirmationDialog = (dialogProps: ConfirmationDialogBoxProps) => {
        setConfirmationDialogProps({
            ...dialogProps,
            onClose: () => setConfirmationDialogVisible(false)
        })
        setConfirmationDialogVisible(true)
    }

    return (
        <>
            <Dialog
                className='cardDialog'
                onClose={props.onClose}
                toolsMenu={!props.readonly && card && (
                    <CardActionsMenu
                        board={board}
                        activeView={activeView}
                        card={card}
                        showCard={props.showCard}
                        onClose={props.onClose}
                        showConfirmationDialog={showConfirmationDialog}
                    />
                )}
                toolbar={toolbar}
            >
                <CardContent
                    board={board}
                    activeView={activeView}
                    views={views}
                    cards={cards}
                    card={card}
                    contents={contents}
                    comments={comments}
                    readonly={props.readonly}
                    isTemplate={isTemplate}
                />
            </Dialog>

            {confirmationDialogVisible && confirmationDialogProps &&
                <ConfirmationDialogBox dialogBox={confirmationDialogProps}/>}
        </>
    )
}

export default CardDialog
