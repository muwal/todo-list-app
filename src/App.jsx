import IconPlus from './assets/icon-plus.svg'
import IconDelete from './assets/icon-delete.svg'
import iconAlert from './assets/icon-alert.svg'
import iconAlertSm from './assets/icon-alert-sm.svg'
import emptyActivity from './assets/empty-activity.png'

import { Modal } from 'flowbite';

import { useEffect, useState } from 'react'

import axios from 'axios'
import moment from 'moment'
import { BrowserRouter as Router, Link } from "react-router-dom";

import Detail from './pages/Detail'

function App() {

	const bareUrl = 'https://todo.api.devcode.gethired.id/'


	const removeBackdrop = () => {
		const backdrop = document.querySelectorAll('.modal-backdrop');
		backdrop.forEach(box => {
			box.remove();
		});
	}

	const $removeActivityModal = document.getElementById('removeActivityModal');
	const removeActivityModal = new Modal($removeActivityModal, {
		closable: true,
		backdropClasses: 'modal-backdrop',
		onHide: () => {
			removeBackdrop()
		},
	});

	const $removeActivitySuccessModal = document.getElementById('removeActivitySuccessModal');
	const removeActivitySuccessModal = new Modal($removeActivitySuccessModal, {
		closable: true,
		backdropClasses: 'modal-backdrop',
		onHide: () => {
			removeBackdrop()
		},
	});

	const [activities, setActivities] = useState(null);

	const displayDate = (date) => {

		return moment(date).format('DD MMM YYYY')

	}

	const getAllActivities = () => {

		axios.get(bareUrl + 'activity-groups?email=awal@skyshi.com')
			.then((response) => {
				const activities = response.data.data
				setActivities(activities);
			});

	}

	useEffect(() => {
		getAllActivities()
	}, []);

	const addActivity = () => {

		axios.post(bareUrl + 'activity-groups', {
			email: "awal@skyshi.com",
			title: "New Activity"
		})
			.then(() => {
				getAllActivities()
			});

	}

	const [activityId, setActivityId] = useState(null)
	const [activityTitle, setActivityTitle] = useState(null)

	const showDeleteActivityModal = (activity) => {

		setActivityId(activity.id)
		setActivityTitle(activity.title)

		removeActivityModal.show()

	}

	const displayActivity = (activities) => {

		if (!activities) {
			return false
		}

		if (activities.length > 0) {
			return (
				activities.map((activity, index) => {
					return (
						<div className="bg-white rounded-2xl shadow-md p-6 w-[235px] flex flex-col" data-cy="activity-item" key={'activity-item' + index} id={'itemTodo' + index}>
							<Link to={`detail/${activity.id}`} element={<Detail />} >
								<div className="font-semibold text-lg h-[160px]" data-cy="activity-item-title">
									{activity.title}
								</div>
							</Link>
							<div className="flex mt-auto">
								<div className="text-slate-500" data-cy="activity-item-date">
									{displayDate(activity.created_at)}
								</div>
								<div className="ml-auto">
									<button onClick={() => showDeleteActivityModal(activity)} data-cy='activity-item-delete-button'>
										<img src={IconDelete} alt="delete" />
									</button>
								</div>
							</div>
						</div>
					)
				})
			)
		} else {
			return (
				<img src={emptyActivity} alt="empty" className="mx-auto" onClick={addActivity} data-cy="activity-empty-state" />
			)
		}

	}

	const deleteActivity = () => {

		axios.delete(bareUrl + 'activity-groups/' + activityId)
			.then(() => {
				getAllActivities()

				setActivityId(null)
				setActivityTitle(null)

				closeDeleteModal()
				removeActivitySuccessModal.show()
			});

	}

	const closeDeleteModal = () => {

		removeActivityModal.hide()

	}


	return (
		<>
			<section>
				<div className="container mx-auto">
					<div className="mt-12 flex items-center">
						<div className="text-3xl font-bold" data-cy="activity-title">
							Activity
						</div>
						<div className="ml-auto">
							<button className="inline-flex py-3 px-6 bg-cyan rounded-full text-white font-semibold" onClick={addActivity} data-cy="activity-add-button">
								<div>
									<img src={IconPlus} alt="icon plus" />
								</div>
								<div className="ml-2">
									Tambah
								</div>
							</button>
						</div>
					</div>
					<div className="flex flex-wrap gap-4 mt-12">
						{displayActivity(activities)}
					</div>
				</div>
			</section>

			<div id="removeActivityModal" tabIndex="-1" aria-hidden="true" data-cy="modal-delete" className="fixed top-0 left-0 right-0 z-50 hidden w-[500px] p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full mx-auto">
				<div className="relative w-full max-w-2xl max-h-full">
					<div className="relative bg-white rounded-2xl shadow py-6">
						<div className="p-6 text-center">
							<img src={iconAlert} alt="icon alert" className="mx-auto" data-cy="modal-delete-icon" />
							<div className="mt-6" data-cy="modal-delete-title">
								Apakah anda yakin menghapus activity&nbsp;
								<span className="font-semibold">
									"{activityTitle}"
								</span>
								?
							</div>
						</div>
						<div className="p-6 flex justify-center gap-4">
							<button className="inline-flex py-3 px-6 bg-slate-100 rounded-full text-slate-500 font-semibold" onClick={() => { closeDeleteModal() }} data-cy="modal-delete-cancel-button">
								Batal
							</button>
							<button className="inline-flex py-3 px-6 bg-red-500 rounded-full text-white font-semibold" onClick={() => { deleteActivity() }} data-cy="modal-delete-confirm-button">
								Hapus
							</button>
						</div>
					</div>
				</div>
			</div>

			<div id="removeActivitySuccessModal" tabIndex="-1" aria-hidden="true" data-cy="modal-information" className="fixed top-0 left-0 right-0 z-50 hidden w-[500px] p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full mx-auto">
				<div className="relative w-full max-w-2xl max-h-full">
					<div className="relative bg-white rounded-2xl shadow py-6">
						<div className="flex items-center px-6">
							<img src={iconAlertSm} alt="icon alert" data-cy="modal-information-icon" />
							<div className="ml-4" data-cy="modal-information-title">
								Activity berhasil dihapus
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default App
