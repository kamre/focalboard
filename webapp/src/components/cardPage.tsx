import React, {useCallback} from 'react'
import {generatePath, Link, useHistory, useRouteMatch} from 'react-router-dom'

import {Board} from '../blocks/board'
import {BoardView} from '../blocks/boardView'
import {Card} from '../blocks/card'
import {useAppSelector} from '../store/hooks'
import {getCard} from '../store/cards'
import {getCardContents} from '../store/contents'
import {getCardComments} from '../store/comments'
import IconButton from '../widgets/buttons/iconButton'
import ArrowCollapse from '../widgets/icons/arrowCollapse.'
import OptionsIcon from '../widgets/icons/options'
import MenuWrapper from '../widgets/menuWrapper'

import CardContent from './cardContent'
import CardActionsMenu from './cardActionsMenu'
import ConfirmationDialogBox, {ConfirmationDialogBoxProps, useConfirmationDialogBox} from './confirmationDialogBox'
import RootPortal from './rootPortal'
import {CardDetailOptions, useCardDetailOptions} from './cardDetail/cardDetail'

import './cardPage.scss'

type ToolbarProps = {
    board: Board
    activeView: BoardView
    card?: Card
    cardOptions: CardDetailOptions
    updateCardOptions: (options: CardDetailOptions) => void
    onClose: () => void
    showCard: (cardId?: string) => void
    showConfirmationDialog: (props: ConfirmationDialogBoxProps) => void
}

const CardPageToolbar = (props: ToolbarProps): JSX.Element | null => {
    const {board, activeView, card, cardOptions} = props
    const match = useRouteMatch<{boardId: string, viewId: string, cardId?: string}>()
    const history = useHistory()

    const onCollapse = useCallback(() => {
        const newLocation = {
            ...history.location,
            search: ''
        }
        history.push(newLocation)
    }, [history])

    if (!card) return null

    const {boardId} = match.params

    return (
        <div className='CardPageToolbar'>
            <div className='CardPageToolbar-LeftSide'>
                <Link to={generatePath(match.path, { boardId })}>
                    {`${board.icon} ${board.title}`}
                </Link>
                {` / ${card.title}`}
            </div>
            <div className='CardPageToolbar-RightSide'>
                <IconButton
                    icon={<ArrowCollapse/>}
                    size='medium'
                    onClick={onCollapse}
                />
                <MenuWrapper>
                    <IconButton
                        size='medium'
                        icon={<OptionsIcon/>}
                    />
                    <CardActionsMenu
                        board={board}
                        activeView={activeView}
                        card={card}
                        cardOptions={cardOptions}
                        showCard={props.showCard}
                        showConfirmationDialog={props.showConfirmationDialog}
                        updateCardOptions={props.updateCardOptions}
                        onClose={props.onClose}
                    />
                </MenuWrapper>
            </div>
        </div>
    )
}

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

const CardPage = (props: Props): JSX.Element => {
    const {board, activeView, cards, views, readonly, cardId} = props
    const card = useAppSelector(getCard(cardId))
    const contents = useAppSelector(getCardContents(cardId))
    const comments = useAppSelector(getCardComments(cardId))
    const isTemplate = card && card.fields.isTemplate
    const [cardOptions, updateCardOptions] = useCardDetailOptions(board.id)
    const [dialogVisible, dialogProps, showDialog] = useConfirmationDialogBox()

    return (
        <div className='CardPage'>
            <CardPageToolbar
                board={board}
                activeView={activeView}
                card={card}
                cardOptions={cardOptions}
                showCard={props.showCard}
                onClose={props.onClose}
                showConfirmationDialog={showDialog}
                updateCardOptions={updateCardOptions}
            />
            <div className='CardPageContent'>
                <CardContent
                    board={board}
                    activeView={activeView}
                    views={views}
                    cards={cards}
                    card={card}
                    comments={comments}
                    contents={contents}
                    options={cardOptions}
                    readonly={readonly}
                    isTemplate={isTemplate}
                />
            </div>
            {dialogVisible && dialogProps &&
                <RootPortal>
                    <ConfirmationDialogBox dialogBox={dialogProps}/>
                </RootPortal>}
        </div>
    )
}

export default React.memo(CardPage)
