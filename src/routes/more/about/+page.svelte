<script>
	import Icon from '@iconify/svelte';

	const highlights = [
		{
			icon: 'ph:stethoscope',
			title: 'Core focus',
			description:
				'Sexual health care, male fertility support, reproductive medicine, and confidential consultations.'
		},
		{
			icon: 'ph:shield-check',
			title: 'Privacy-first',
			description:
				'The clinic says privacy is a priority and positions its consultations as discreet and judgment-free.'
		},
		{
			icon: 'ph:phone-call',
			title: 'Reach them',
			description: '+91 97102 04044 · All days 9AM - 9PM'
		}
	];

	const focusAreas = [
		'Male sexual health care, including erectile dysfunction, premature ejaculation, delayed ejaculation, and related concerns.',
		'Male and couple fertility care, with evaluation, IVF, ICSI, IUI, sperm-related procedures, and reproductive medicine services.',
		'STD / STI testing and treatment, including HIV prevention support, STI diagnosis, and ongoing care.',
		'Patient education through FAQs, articles, service pages, and condition-specific explainers on the official site.'
	];

	const doctors = [
		{
			name: 'Dr. Karthik Gunasekaran',
			role: 'Sexologist',
			description:
				'Listed as a sexologist, general surgeon, and laparoscopic surgeon with 26 years of experience.'
		},
		{
			name: 'Dr. Manu Lakshmi',
			role: 'Reproductive medicine / gynecology',
			description:
				'Listed on the site as part of the clinical team, with reproductive medicine and ultrasonography credentials.'
		}
	];

	const resourceLinks = [
		{
			label: 'Official Website',
			href: 'https://www.metromaleclinic.com/',
			description: 'Main website and service overview',
			icon: 'ph:globe'
		},
		{
			label: 'About Us',
			href: 'https://www.metromaleclinic.com/about-metromale-clinic-and-fertility-center/',
			description: 'Clinic background and care philosophy',
			icon: 'ph:info'
		},
		{
			label: 'Contact Us',
			href: 'https://www.metromaleclinic.com/contact-us/',
			description: 'T Nagar contact page and branch links',
			icon: 'ph:map-pin'
		},
		{
			label: 'Privacy Policy',
			href: 'https://www.metromaleclinic.com/privacy-policy/',
			description: 'Website privacy and data-use page',
			icon: 'ph:lock'
		},
		{
			label: 'FAQs',
			href: 'https://www.metromaleclinic.com/please-stop-and-read-faqs-on-metromale-clinic-fertility-center/',
			description: 'Official FAQ-style article from the site',
			icon: 'ph:question'
		},
		{
			label: 'Latest Article',
			href: 'https://www.metromaleclinic.com/penile-hypersensitivity-premature-ejaculation-treatment-options/',
			description: 'One of the latest public posts listed on the site',
			icon: 'ph:newspaper'
		}
	];
</script>

<svelte:head>
	<title>About Metromale</title>
</svelte:head>

<div class="space-y-6 p-4 md:p-8">
	<section
		class="overflow-hidden rounded-4xl bg-linear-to-br from-primary via-orange-400 to-amber-300 p-1 shadow-xl/5"
	>
		<div class="rounded-[calc(2rem-1px)] bg-white/95 p-6">
			<p class="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">About Metromale</p>
			<h1 class="mt-2 text-2xl font-semibold text-gray-900">Clinic info from the official site</h1>
			<p class="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
				Metromale Clinic & Fertility Center presents itself as a sexual health and fertility
				clinic focused on confidential care, reproductive medicine, fertility support, and
				patient education. Their public site emphasizes evidence-based treatment, a
				patient-friendly experience, and easy ways to contact the clinic online or by phone.
			</p>

			<div class="mt-5 flex flex-wrap gap-3">
				<a
					href="https://www.metromaleclinic.com/"
					target="_blank"
					rel="noreferrer"
					class="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
				>
					<Icon icon="ph:globe" class="size-4" />
					Visit Website
				</a>

				<a
					href="https://www.metromaleclinic.com/privacy-policy/"
					target="_blank"
					rel="noreferrer"
					class="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-transform active:scale-[0.98]"
				>
					<Icon icon="ph:lock" class="size-4" />
					Privacy Policy
				</a>
			</div>
		</div>
	</section>

	<section class="grid gap-4 sm:grid-cols-3">
		{#each highlights as item (item.title)}
			<div class="rounded-3xl bg-white p-5 shadow-lg/1">
				<div class="flex items-start gap-4">
					<div class="rounded-2xl bg-gray-100 p-3 text-gray-600">
						<Icon icon={item.icon} class="size-5" />
					</div>
					<div>
						<h2 class="text-base font-semibold text-gray-900">{item.title}</h2>
						<p class="mt-2 text-sm leading-6 text-gray-500">{item.description}</p>
					</div>
				</div>
			</div>
		{/each}
	</section>

	<section class="rounded-3xl bg-white p-5 shadow-lg/1">
		<div class="flex items-center gap-3">
			<div class="rounded-2xl bg-orange-50 p-3 text-orange-500">
				<Icon icon="ph:list-checks" class="size-6" />
			</div>
			<div>
				<h2 class="text-lg font-semibold text-gray-900">What the website says they do</h2>
				<p class="text-sm text-gray-500">A simple dump of the main service themes on the official site.</p>
			</div>
		</div>

		<div class="mt-5 grid gap-3">
			{#each focusAreas as item (item)}
				<div class="rounded-2xl bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-700">
					{item}
				</div>
			{/each}
		</div>
	</section>

	<section class="grid gap-4 sm:grid-cols-2">
		{#each doctors as doctor (doctor.name)}
			<div class="rounded-3xl bg-white p-5 shadow-lg/1">
				<div class="flex items-start gap-4">
					<div class="rounded-2xl bg-red-50 p-3 text-red-400">
						<Icon icon="ph:user-circle" class="size-6" />
					</div>
					<div>
						<p class="text-sm font-medium text-gray-500">{doctor.role}</p>
						<h2 class="mt-1 text-lg font-semibold text-gray-900">{doctor.name}</h2>
						<p class="mt-3 text-sm leading-6 text-gray-600">{doctor.description}</p>
					</div>
				</div>
			</div>
		{/each}
	</section>

	<section class="rounded-3xl bg-white p-5 shadow-lg/1">
		<div class="flex items-center gap-3">
			<div class="rounded-2xl bg-emerald-50 p-3 text-emerald-500">
				<Icon icon="ph:shield-star" class="size-6" />
			</div>
			<div>
				<h2 class="text-lg font-semibold text-gray-900">Privacy snapshot</h2>
				<p class="text-sm text-gray-500">Pulled from the official privacy-policy page.</p>
			</div>
		</div>

		<div class="mt-5 space-y-3 text-sm leading-6 text-gray-700">
			<p class="rounded-2xl bg-gray-50 px-4 py-3">
				The policy says the website is not collecting newsletter or promotional details and
				that information entered on the site is mainly tied to making appointments.
			</p>
			<p class="rounded-2xl bg-gray-50 px-4 py-3">
				It also says contact information is stored on their hosting servers, used to contact
				people about appointments, and not sold to other parties.
			</p>
			<p class="rounded-2xl bg-gray-50 px-4 py-3">
				The same page says they do not use third-party tracking cookies beyond Google
				Analytics.
			</p>
		</div>
	</section>

	<section class="rounded-3xl bg-white p-5 shadow-lg/1">
		<div class="flex items-center gap-3">
			<div class="rounded-2xl bg-sky-50 p-3 text-sky-500">
				<Icon icon="ph:link-simple" class="size-6" />
			</div>
			<div>
				<h2 class="text-lg font-semibold text-gray-900">Official links</h2>
				<p class="text-sm text-gray-500">Useful pages from Metromale’s public website.</p>
			</div>
		</div>

		<div class="mt-5 grid gap-3 sm:grid-cols-2">
			{#each resourceLinks as item (item.href)}
				<button
					type="button"
					onclick={() => window.open(item.href, '_blank', 'noopener,noreferrer')}
					class="group rounded-3xl bg-gray-50 p-4 transition-transform active:scale-[0.98]"
				>
					<div class="flex items-start justify-between gap-4">
						<div>
							<h3 class="text-base font-semibold text-gray-900">{item.label}</h3>
							<p class="mt-2 text-sm text-gray-500">{item.description}</p>
						</div>
						<div
							class="rounded-2xl bg-white p-3 text-gray-500 transition-colors group-hover:bg-primary/10 group-hover:text-primary"
						>
							<Icon icon={item.icon} class="size-5" />
						</div>
					</div>
				</button>
			{/each}
		</div>
	</section>
</div>
